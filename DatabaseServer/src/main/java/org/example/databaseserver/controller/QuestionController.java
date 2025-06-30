package org.example.databaseserver.controller;

import org.example.databaseserver.objects.entities.Question;
import org.example.databaseserver.repos.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;
import java.util.Optional;

@Controller
@RequestMapping("/api/questions")
public class QuestionController {
    @Autowired
    private QuestionRepository questionRepository;

    @GetMapping
    public ResponseEntity<List<Question>> getQuestions() {
        return ResponseEntity.ok().body(questionRepository.findAll());
    }

    @GetMapping("/{order}")
    public ResponseEntity<Question> getQuestion(@PathVariable Long order) {
        Optional<Question> question = questionRepository.findByQuestionOrder(order);
        return question.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

//    @PostMapping
//    public ResponseEntity<Question> createQuestion(@RequestBody Question player) {
//        return ResponseEntity.ok().body(questionRepository.save(player));
//    }
}
