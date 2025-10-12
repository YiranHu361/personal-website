package com.yiranhu.wordle.controller;

import com.yiranhu.wordle.model.WordleRequest;
import com.yiranhu.wordle.model.WordleResponse;
import com.yiranhu.wordle.service.WordleSolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wordle")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "https://*.vercel.app", "https://*.netlify.app"}, methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.OPTIONS}, allowedHeaders = "*")
public class WordleController {

    @Autowired
    private WordleSolver wordleSolver;

    @PostMapping("/solve")
    public ResponseEntity<WordleResponse> solve(@RequestBody WordleRequest request) {
        WordleResponse response = wordleSolver.solve(request.getWord(), request.getHints());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Wordle Solver API is running!");
    }
}
