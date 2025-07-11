package org.example.databaseserver.objects.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.Set;

@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "questionIdSequence")
    public Long id;
    public String questionText;
    @Column(columnDefinition = "text")
    public String picturePath;
    @Column(columnDefinition = "text")
    public String revealPicturePath;
    @OneToMany(cascade = CascadeType.PERSIST)
    public Set<Answer> answers;
    public int time;
    public Boolean showAnswers;
}
