package com.yiranhu.wordle.model;

public class WordleRequest {
    private String word;
    private String hints;

    public WordleRequest() {}

    public WordleRequest(String word, String hints) {
        this.word = word;
        this.hints = hints;
    }

    public String getWord() {
        return word;
    }

    public void setWord(String word) {
        this.word = word;
    }

    public String getHints() {
        return hints;
    }

    public void setHints(String hints) {
        this.hints = hints;
    }
}
