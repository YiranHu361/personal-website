package com.yiranhu.wordle.model;

import java.util.List;

public class WordleResponse {
    private List<String> suggestions;
    private String message;
    private boolean success;

    public WordleResponse() {}

    public WordleResponse(List<String> suggestions, String message, boolean success) {
        this.suggestions = suggestions;
        this.message = message;
        this.success = success;
    }

    public List<String> getSuggestions() {
        return suggestions;
    }

    public void setSuggestions(List<String> suggestions) {
        this.suggestions = suggestions;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }
}
