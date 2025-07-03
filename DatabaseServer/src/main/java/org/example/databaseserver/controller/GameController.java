package org.example.databaseserver.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.databaseserver.objects.entities.Game;
import org.example.databaseserver.objects.entities.Player;
import org.example.databaseserver.repos.GameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Objects;

@Controller
@RequestMapping("/api/game")
public class GameController {
    @Autowired
    private GameRepository gameRepository;
    @Autowired
    private PlayerController playerController;

    @PostMapping
    public ResponseEntity<Game> openGame() {
        return ResponseEntity.status(HttpStatus.CREATED).body(gameRepository.save(new Game(null, null, "[]", false)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Game> getGame(@PathVariable Long id) {
        return ResponseEntity.ok(gameRepository.findById(id).orElseThrow(RuntimeException::new));
    }

    @GetMapping("/touchComponents/{id}")
    public ResponseEntity<Object> getGamesTouchComponents(@PathVariable Long id) throws JsonProcessingException {
        return ResponseEntity.ok(gameRepository.findById(id).orElseThrow(RuntimeException::new).getTouchComponentsJson());
    }

    @PutMapping("/{id}/{pId}")
    public ResponseEntity<Game> addPlayerToGame(@PathVariable Long id, @PathVariable Long pId) {
        Game game = gameRepository.findById(id).orElseThrow();
        Player player = playerController.getPlayer(pId).getBody();
        game.players.add(player);
        gameRepository.save(game);
        return ResponseEntity.ok(game);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Game> setTouchComponents(@PathVariable Long id, @RequestBody String touchComponents) {
        Game game = gameRepository.findById(id).orElseThrow();
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

        ObjectMapper mapper = new ObjectMapper();

        for (Map.Entry<String, Object> entry : updates.entrySet()) {
            switch (entry.getKey()) {
                case "hasStarted" -> game.hasStarted = (Boolean) entry.getValue();

                case "touchComponents" -> {
                    List<Map<String, Object>> components =
                            mapper.convertValue(entry.getValue(), new TypeReference<>() {});
                    game.setTouchComponentsJson(components);
                }

                default -> throw new IllegalArgumentException("Unknown field: " + entry.getKey());
            }
        }

        gameRepository.save(game);
        return ResponseEntity.ok(game);
    }
}
