package main

import (
	"flag"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"time"

	"github.com/charmbracelet/bubbles/textinput"
	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/lipgloss"
)

const dateLayout = "2006-01-02"

var (
	titleStyle    = lipgloss.NewStyle().Bold(true).Foreground(lipgloss.Color("170"))
	promptStyle   = lipgloss.NewStyle().Bold(true)
	helpStyle     = lipgloss.NewStyle().Faint(true)
	errorStyle    = lipgloss.NewStyle().Foreground(lipgloss.Color("203"))
	selectedStyle = lipgloss.NewStyle().Foreground(lipgloss.Color("170"))
	doneStyle     = lipgloss.NewStyle().Foreground(lipgloss.Color("42"))
	keyStyle      = lipgloss.NewStyle().Faint(true)
)

type fieldKind int

const (
	kindText fieldKind = iota
	kindChoice
	kindBool
)

type field struct {
	key      string
	prompt   string
	help     string
	kind     fieldKind
	required bool

	input   textinput.Model
	options []string
	cursor  int
	flag    bool
}

func (f *field) display() string {
	switch f.kind {
	case kindChoice:
		return f.options[f.cursor]
	case kindBool:
		if f.flag {
			return "yes"
		}
		return "no"
	default:
		return strings.TrimSpace(f.input.Value())
	}
}

type model struct {
	fields     []*field
	index      int
	outDir     string
	err        string
	confirm    bool
	written    string
	quitting   bool
	slugEdited bool
}

func newTextField(key, prompt, help, placeholder string, required bool) *field {
	in := textinput.New()
	in.Placeholder = placeholder
	in.Prompt = "> "
	in.CharLimit = 0
	in.Width = 70
	return &field{key: key, prompt: prompt, help: help, kind: kindText, required: required, input: in}
}

func newModel(outDir string, categories []string) model {
	title := newTextField("title", "Title", "The post title, shown everywhere.", "How I stopped worrying", true)
	title.input.Focus()

	fields := []*field{
		title,
		newTextField("slug", "Slug", "Filename without extension. Derived from the title until you edit it.", "how-i-stopped-worrying", true),
		newTextField("description", "Description", "One or two sentences. Used for SEO and the post list.", "A short summary", true),
		newTextField("tldr", "TL;DR", "Optional longer summary shown at the top of the post.", "leave empty to skip", false),
		newTextField("pubDate", "Publication date", "YYYY-MM-DD.", dateLayout, true),
		{key: "category", prompt: "Category", help: "Drives the category filter and the quotes.", kind: kindChoice, options: append([]string{"(none)"}, categories...)},
		newTextField("tags", "Tags", "Comma separated.", "ai, agents, lisp", false),
		newTextField("link", "External link", "Optional URL the post points at (repo, paper, ...).", "https://github.com/...", false),
		newTextField("ogImage", "OG image", "Optional social card image key.", "og2", false),
		{key: "draft", prompt: "Draft", help: "Drafts are excluded from the published build.", kind: kindBool, flag: true},
	}

	for _, f := range fields {
		if f.key == "pubDate" {
			f.input.SetValue(time.Now().Format(dateLayout))
		}
	}

	return model{fields: fields, outDir: outDir}
}

func (m model) Init() tea.Cmd {
	return textinput.Blink
}

func (m *model) current() *field { return m.fields[m.index] }

func (m *model) focus(i int) {
	for idx, f := range m.fields {
		if f.kind != kindText {
			continue
		}
		if idx == i {
			f.input.Focus()
		} else {
			f.input.Blur()
		}
	}
	m.index = i
}

func (m *model) validate(f *field) string {
	value := f.display()
	if f.required && value == "" {
		return f.prompt + " is required"
	}
	if f.key == "pubDate" {
		if _, err := time.Parse(dateLayout, value); err != nil {
			return "date must look like " + dateLayout
		}
	}
	if f.key == "slug" && value != "" {
		if _, err := os.Stat(m.path(value)); err == nil {
			return m.path(value) + " already exists"
		}
	}
	return ""
}

func (m model) path(slug string) string {
	return filepath.Join(m.outDir, slug+".md")
}

func (m model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	key, ok := msg.(tea.KeyMsg)
	if !ok {
		var cmd tea.Cmd
		if f := m.current(); f.kind == kindText {
			f.input, cmd = f.input.Update(msg)
		}
		return m, cmd
	}

	switch key.Type {
	case tea.KeyCtrlC, tea.KeyEsc:
		m.quitting = true
		return m, tea.Quit
	}

	if m.confirm {
		switch key.String() {
		case "enter":
			path, err := m.write()
			if err != nil {
				m.err = err.Error()
				m.confirm = false
				return m, nil
			}
			m.written = path
			return m, tea.Quit
		case "shift+tab":
			m.confirm = false
			m.focus(len(m.fields) - 1)
		}
		return m, nil
	}

	f := m.current()
	m.err = ""

	switch key.String() {
	case "enter", "tab":
		if msg := m.validate(f); msg != "" {
			m.err = msg
			return m, nil
		}
		if f.key == "title" && !m.slugEdited {
			m.fields[1].input.SetValue(slugify(f.display()))
		}
		if m.index == len(m.fields)-1 {
			m.confirm = true
			return m, nil
		}
		m.focus(m.index + 1)
		return m, textinput.Blink
	case "shift+tab":
		if m.index > 0 {
			m.focus(m.index - 1)
		}
		return m, textinput.Blink
	}

	switch f.kind {
	case kindChoice:
		switch key.String() {
		case "up", "k":
			if f.cursor > 0 {
				f.cursor--
			}
		case "down", "j":
			if f.cursor < len(f.options)-1 {
				f.cursor++
			}
		}
		return m, nil
	case kindBool:
		switch key.String() {
		case "up", "down", "left", "right", " ", "y", "n":
			f.flag = !f.flag
		}
		return m, nil
	}

	var cmd tea.Cmd
	f.input, cmd = f.input.Update(msg)
	if f.key == "slug" {
		m.slugEdited = true
	}
	return m, cmd
}

func (m model) View() string {
	if m.written != "" {
		return doneStyle.Render("✓ created ") + m.written + "\n"
	}
	if m.quitting {
		return helpStyle.Render("aborted, nothing written") + "\n"
	}

	var b strings.Builder
	b.WriteString(titleStyle.Render("new blog post") + "\n\n")

	for i, f := range m.fields {
		if i > m.index && !m.confirm {
			break
		}
		if i != m.index || m.confirm {
			value := f.display()
			if value == "" || value == "(none)" {
				value = helpStyle.Render("—")
			}
			b.WriteString(fmt.Sprintf("  %s %s\n", helpStyle.Render(f.prompt+":"), value))
			continue
		}
		b.WriteString("\n" + promptStyle.Render(f.prompt) + "\n")
		b.WriteString(helpStyle.Render(f.help) + "\n")
		b.WriteString(m.renderInput(f) + "\n")
	}

	if m.confirm {
		b.WriteString("\n" + promptStyle.Render("Write "+m.path(m.fields[1].display())+"?") + "\n")
	}
	if m.err != "" {
		b.WriteString("\n" + errorStyle.Render("! "+m.err) + "\n")
	}

	b.WriteString("\n" + keyStyle.Render(m.footer()) + "\n")
	return b.String()
}

func (m model) renderInput(f *field) string {
	switch f.kind {
	case kindChoice:
		var b strings.Builder
		for i, opt := range f.options {
			if i == f.cursor {
				b.WriteString(selectedStyle.Render("> "+opt) + "\n")
			} else {
				b.WriteString("  " + opt + "\n")
			}
		}
		return strings.TrimRight(b.String(), "\n")
	case kindBool:
		yes, no := "  yes", "  no"
		if f.flag {
			yes = selectedStyle.Render("> yes")
		} else {
			no = selectedStyle.Render("> no")
		}
		return yes + "\n" + no
	default:
		return f.input.View()
	}
}

func (m model) footer() string {
	if m.confirm {
		return "enter write · shift+tab back · esc cancel"
	}
	switch m.current().kind {
	case kindChoice:
		return "↑/↓ choose · enter next · shift+tab back · esc cancel"
	case kindBool:
		return "space toggle · enter next · shift+tab back · esc cancel"
	default:
		return "enter next · shift+tab back · esc cancel"
	}
}

func (m model) write() (string, error) {
	get := func(key string) string {
		for _, f := range m.fields {
			if f.key == key {
				return f.display()
			}
		}
		return ""
	}

	var fm strings.Builder
	fm.WriteString("---\n")
	fm.WriteString("title: " + yamlString(get("title")) + "\n")
	fm.WriteString("description: " + yamlString(get("description")) + "\n")
	fm.WriteString("pubDate: " + get("pubDate") + "\n")
	if c := get("category"); c != "(none)" && c != "" {
		fm.WriteString("category: " + yamlString(c) + "\n")
	}
	if tags := splitTags(get("tags")); len(tags) > 0 {
		quoted := make([]string, len(tags))
		for i, t := range tags {
			quoted[i] = yamlString(t)
		}
		fm.WriteString("tags: [" + strings.Join(quoted, ", ") + "]\n")
	}
	if v := get("ogImage"); v != "" {
		fm.WriteString("ogImage: " + yamlString(v) + "\n")
	}
	if v := get("link"); v != "" {
		fm.WriteString("link: " + yamlString(v) + "\n")
	}
	if v := get("tldr"); v != "" {
		fm.WriteString("tldr: " + yamlString(v) + "\n")
	}
	if get("draft") == "yes" {
		fm.WriteString("draft: true\n")
	}
	fm.WriteString("---\n\n")

	path := m.path(get("slug"))
	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		return "", err
	}
	// O_EXCL: the slug check happens while typing, so guard the actual write too.
	f, err := os.OpenFile(path, os.O_WRONLY|os.O_CREATE|os.O_EXCL, 0o644)
	if err != nil {
		return "", err
	}
	defer f.Close()
	if _, err := f.WriteString(fm.String()); err != nil {
		return "", err
	}
	return path, nil
}

var nonSlug = regexp.MustCompile(`[^a-z0-9]+`)

func slugify(s string) string {
	return strings.Trim(nonSlug.ReplaceAllString(strings.ToLower(s), "-"), "-")
}

func splitTags(s string) []string {
	var out []string
	for _, part := range strings.Split(s, ",") {
		if t := strings.TrimSpace(part); t != "" {
			out = append(out, t)
		}
	}
	return out
}

func yamlString(s string) string {
	if strings.Contains(s, "'") {
		r := strings.NewReplacer(`\`, `\\`, `"`, `\"`)
		return `"` + r.Replace(s) + `"`
	}
	return "'" + s + "'"
}

var categoryKey = regexp.MustCompile(`(?m)^[\t ]+([A-Za-z0-9_-]+):[\t ]*\{`)

// Categories live in the TS source; parse them so the two never drift.
func readCategories(path string) []string {
	src, err := os.ReadFile(path)
	if err != nil {
		return nil
	}
	_, rest, found := strings.Cut(string(src), "export const CATEGORIES = {")
	if !found {
		return nil
	}
	block, _, found := strings.Cut(rest, "\n} as const;")
	if !found {
		return nil
	}
	var out []string
	for _, m := range categoryKey.FindAllStringSubmatch(block, -1) {
		out = append(out, m[1])
	}
	return out
}

func main() {
	outDir := flag.String("out", "src/content/blog", "directory the post is written to")
	categoriesFile := flag.String("categories", "src/lib/categories.ts", "TS file the category list is read from")
	flag.Parse()

	categories := readCategories(*categoriesFile)
	if len(categories) == 0 {
		fmt.Fprintf(os.Stderr, "warning: no categories found in %s\n", *categoriesFile)
	}

	m, err := tea.NewProgram(newModel(*outDir, categories)).Run()
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
	if final, ok := m.(model); ok && final.written == "" {
		os.Exit(1)
	}
}
