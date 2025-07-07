package org.example.databaseserver.controller;

import org.example.databaseserver.objects.entities.Question;
import org.example.databaseserver.objects.entities.QuestionSet;
import org.example.databaseserver.repos.QuestionRepository;
import org.example.databaseserver.repos.QuestionSetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Controller
@RequestMapping("/api/questions")
public class QuestionController {
    @Autowired
    private QuestionRepository questionRepository;
    @Autowired
    private QuestionSetRepository questionSetRepository;

    @GetMapping
    public ResponseEntity<List<Question>> getQuestions() {
        return ResponseEntity.ok().body(questionRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Question> getQuestion(@PathVariable Long id) {
        Optional<Question> question = questionRepository.findById(id);
        return question.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/set/{id}")
    public ResponseEntity<QuestionSet> getQuestionSet(@PathVariable Long id) {
        Optional<QuestionSet> questionSet = questionSetRepository.findById(id);
        return questionSet.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/set")
    public ResponseEntity<List<QuestionSet>> getQuestionSets() {
        return ResponseEntity.ok().body(questionSetRepository.findAll());
    }

    @PostMapping("/set")
    public ResponseEntity<QuestionSet> createQuestionSet(@RequestBody QuestionSet questionSet) {
        return ResponseEntity.ok().body(questionSetRepository.save(questionSet));
    }
}
