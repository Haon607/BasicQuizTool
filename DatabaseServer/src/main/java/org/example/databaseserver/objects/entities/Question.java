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
    public String picturePath;
    @OneToMany
    public Set<Answer> answers;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "set_id")
    public QuestionSet set;
}
