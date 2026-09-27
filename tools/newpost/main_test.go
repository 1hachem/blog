package main

import (
	"os"
	"path/filepath"
	"strings"
	"testing"

	tea "github.com/charmbracelet/bubbletea"
)

func typeText(t *testing.T, m tea.Model, s string) tea.Model {
	t.Helper()
	m, _ = m.Update(tea.KeyMsg{Type: tea.KeyRunes, Runes: []rune(s)})
	return m
}

func press(t *testing.T, m tea.Model, k tea.KeyType) tea.Model {
	t.Helper()
	m, _ = m.Update(tea.KeyMsg{Type: k})
	return m
}

func TestSlugify(t *testing.T) {
	cases := map[string]string{
		"Hello, World's post":    "hello-world-s-post",
		"  Trailing --- dashes ": "trailing-dashes",
		"lisptc — a Lisp":        "lisptc-a-lisp",
	}
	for in, want := range cases {
		if got := slugify(in); got != want {
			t.Errorf("slugify(%q) = %q, want %q", in, got, want)
		}
	}
}

func TestYamlString(t *testing.T) {
	if got := yamlString("plain"); got != "'plain'" {
		t.Errorf("got %q", got)
	}
	if got := yamlString("it's"); got != `"it's"` {
		t.Errorf("got %q", got)
	}
	if got := yamlString(`a "quote" and it's`); got != `"a \"quote\" and it's"` {
		t.Errorf("got %q", got)
	}
}

func TestReadCategories(t *testing.T) {
	got := readCategories(filepath.Join("..", "..", "src", "lib", "categories.ts"))
	want := []string{"general", "tech", "startup", "lifestyle"}
	if strings.Join(got, ",") != strings.Join(want, ",") {
		t.Errorf("got %v, want %v", got, want)
	}
}

func TestFullRunWritesFrontmatter(t *testing.T) {
	dir := t.TempDir()
	var m tea.Model = newModel(dir, []string{"general", "tech"})

	m = typeText(t, m, "Hello, World's post")
	m = press(t, m, tea.KeyEnter) // title -> slug, slug auto-filled
	m = press(t, m, tea.KeyEnter) // slug
	m = typeText(t, m, "A description")
	m = press(t, m, tea.KeyEnter) // description
	m = press(t, m, tea.KeyEnter) // tldr, empty
	m = press(t, m, tea.KeyEnter) // pubDate, today
	m, _ = m.Update(tea.KeyMsg{Type: tea.KeyDown})
	m, _ = m.Update(tea.KeyMsg{Type: tea.KeyDown})
	m = press(t, m, tea.KeyEnter) // category -> tech
	m = typeText(t, m, "ai, agents,lisp")
	m = press(t, m, tea.KeyEnter) // tags
	m = press(t, m, tea.KeyEnter) // link, empty
	m = typeText(t, m, "og2")
	m = press(t, m, tea.KeyEnter)                                       // ogImage
	m, _ = m.Update(tea.KeyMsg{Type: tea.KeyRunes, Runes: []rune(" ")}) // draft -> no
	m = press(t, m, tea.KeyEnter)                                       // draft -> confirm
	m = press(t, m, tea.KeyEnter)                                       // write

	final := m.(model)
	if final.written == "" {
		t.Fatalf("nothing written, err=%q", final.err)
	}

	body, err := os.ReadFile(filepath.Join(dir, "hello-world-s-post.md"))
	if err != nil {
		t.Fatal(err)
	}
	got := string(body)
	for _, want := range []string{
		`title: "Hello, World's post"`,
		"description: 'A description'",
		"category: 'tech'",
		"tags: ['ai', 'agents', 'lisp']",
		"ogImage: 'og2'",
	} {
		if !strings.Contains(got, want) {
			t.Errorf("missing %q in:\n%s", want, got)
		}
	}
	for _, unwanted := range []string{"tldr:", "link:", "draft:"} {
		if strings.Contains(got, unwanted) {
			t.Errorf("unexpected %q in:\n%s", unwanted, got)
		}
	}
}

func TestSlugCollisionBlocks(t *testing.T) {
	dir := t.TempDir()
	if err := os.WriteFile(filepath.Join(dir, "taken.md"), []byte("x"), 0o644); err != nil {
		t.Fatal(err)
	}
	var m tea.Model = newModel(dir, []string{"tech"})
	m = typeText(t, m, "Taken")
	m = press(t, m, tea.KeyEnter) // title
	m = press(t, m, tea.KeyEnter) // slug "taken" collides

	final := m.(model)
	if !strings.Contains(final.err, "already exists") {
		t.Fatalf("expected a collision error, got %q", final.err)
	}
	if final.index != 1 {
		t.Fatalf("expected to stay on the slug field, got index %d", final.index)
	}
}
