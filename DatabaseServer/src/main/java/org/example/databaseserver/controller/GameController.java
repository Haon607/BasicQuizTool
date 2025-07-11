package org.example.databaseserver.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.databaseserver.objects.entities.Game;
import org.example.databaseserver.objects.entities.Player;
import org.example.databaseserver.repos.GameRepository;
import org.example.databaseserver.repos.QuestionSetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/api/game")
public class GameController {
    @Autowired
    private GameRepository gameRepository;
    @Autowired
    private PlayerController playerController;
    @Autowired
    private QuestionSetRepository questionSetRepository;

    @PostMapping
    public ResponseEntity<Game> openGame() {
        return ResponseEntity.status(HttpStatus.CREATED).body(gameRepository.save(new Game(null, null, "[]", false, null, false, 0L)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Game> getGame(@PathVariable Long id) {
        Game game = gameRepository.findById(id).orElseThrow(RuntimeException::new);
        validateGameNotEnded(game);
        return ResponseEntity.ok(game);
    }

    @GetMapping("/touchComponents/{id}")
    public ResponseEntity<Object> getGamesTouchComponents(@PathVariable Long id) throws JsonProcessingException {
        Game game = gameRepository.findById(id).orElseThrow(RuntimeException::new);
        validateGameNotEnded(game);
        return ResponseEntity.ok(game.getTouchComponentsJson());
    }

    @PutMapping("/{id}/{pId}")
    public ResponseEntity<Game> addPlayerToGame(@PathVariable Long id, @PathVariable Long pId) {
        Game game = gameRepository.findById(id).orElseThrow();
        validateGameNotEnded(game);
        Player player = playerController.getPlayer(pId).getBody();
        game.players.add(player);
        gameRepository.save(game);
        return ResponseEntity.ok(game);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Game> setTouchComponents(@PathVariable Long id, @RequestBody String touchComponents) {
        Game game = gameRepository.findById(id).orElseThrow();
        validateGameNotEnded(game);
        game.touchComponents = touchComponents;
        gameRepository.save(game);
        return ResponseEntity.ok(game);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Game> patchGame(
            @PathVariable Long id,
            @RequestBody Map<String, Object> updates) throws JsonProcessingException {

        Game game = gameRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Game not found"));

        validateGameNotEnded(game);

        ObjectMapper mapper = new ObjectMapper();

        for (Map.Entry<String, Object> entry : updates.entrySet()) {
            String key = entry.getKey();
            Object value = entry.getValue();

            switch (key) {
                case "hasStarted" -> {
                    if (!(value instanceof Boolean))
                        throw new IllegalArgumentException("hasStarted must be a boolean");
                    game.hasStarted = (Boolean) value;
                }

                case "hasEnded" -> {
                    if (!(value instanceof Boolean))
                        throw new IllegalArgumentException("hasEnded must be a boolean");
                    game.hasEnded = (Boolean) value;
                }

                case "questionNumber" -> {
                    if (!(value instanceof Number))
                        throw new IllegalArgumentException("questionNumber must be a number");
                    game.questionNumber = ((Number) value).longValue();
                }

                case "touchComponents" -> {
                    List<Map<String, Object>> components =
                            mapper.convertValue(value, new TypeReference<>() {});
                    game.setTouchComponentsJson(components);
                }

                case "questionSet" -> {
                    if (!(value instanceof Number))
                        throw new IllegalArgumentException("questionSet must be a number (ID)");
                    Long qsId = ((Number) value).longValue();
                    game.questionSet = questionSetRepository.findById(qsId)
                            .orElseThrow(() -> new IllegalArgumentException("QuestionSet not found: " + qsId));
                }

                default -> throw new IllegalArgumentException("Unknown field: " + key);
            }
        }

        gameRepository.save(game);
        return ResponseEntity.ok(game);
    }

    /** Prevent access to ended games */
    private void validateGameNotEnded(Game game) {
        if (game.hasEnded) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Game has ended and cannot be accessed or modified.");
        }
    }
}
