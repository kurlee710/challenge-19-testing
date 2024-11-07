describe("Quiz Component End-to-End Test", () => {
  beforeEach(() => {
    cy.visit("localhost:3001"); // URL for the app
  });

  it("should start the quiz and complete all questions", () => {
    // Start the quiz
    cy.contains("Start Quiz").click();

    // Wait for questions to load
    cy.get('[data-cy="quiz-question"]').should("exist");

    // Answer each question until the quiz is completed
    cy.get("body").then(($body) => {
      function answerQuestions() {
        if ($body.find('[data-cy="quiz-question"]').length) {
          cy.get('[data-cy="quiz-question"]').first().click();
          cy.get("body").then(() => answerQuestions()); // Recursively call until quiz completes
        }
      }
      answerQuestions();
    });

    // Verify that the quiz is completed and displays the score
    cy.contains("Quiz Completed").should("exist");
    cy.get(".alert.alert-success").should("contain", "Your score:");

    // Restart the quiz
    cy.contains("Take New Quiz").click();

    // Verify that the quiz has restarted
    // cy.contains("Start Quiz").should("exist");
  });
});
