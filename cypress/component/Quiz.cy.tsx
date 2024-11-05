// cypress/component/Quiz.cy.tsx
import Quiz from "../../client/src/components/Quiz";
import { mount } from "cypress/react18";

// Mock question data
const mockQuestions = [
  {
    _id: "1", // Unique IDs for each question
    question: "What is the capital of France?",
    answers: [
      { text: "Paris", isCorrect: true },
      { text: "London", isCorrect: false },
      { text: "Berlin", isCorrect: false },
    ],
  },
  {
    _id: "2", // Unique IDs for each question
    question: "What is 2 + 2?",
    answers: [
      { text: "3", isCorrect: false },
      { text: "4", isCorrect: true },
      { text: "5", isCorrect: false },
    ],
  },
];

describe("Quiz Component", () => {
  it("displays the Start Quiz button initially", () => {
    mount(<Quiz />);
    cy.contains("Start Quiz").should("be.visible");
  });

  it("loads questions and starts the quiz on clicking Start Quiz", () => {
    // Adjust the route to match what the component is requesting
    cy.intercept("GET", "/api/questions/random", mockQuestions).as(
      "getQuestions"
    );
    mount(<Quiz />);

    cy.contains("Start Quiz").click();
    cy.wait("@getQuestions"); // Wait for the request to finish
    cy.get(".spinner-border").should("not.exist");
    cy.contains(mockQuestions[0].question).should("be.visible");
  });

  it("shows next question after answering a question", () => {
    cy.intercept("GET", "/api/questions/random", mockQuestions).as(
      "getQuestions"
    );
    mount(<Quiz />);

    cy.contains("Start Quiz").click();
    cy.wait("@getQuestions"); // Wait for the request to finish
    cy.get("[data-cy=quiz-question]").first().click(); // Click the first answer
    // cy.contains(mockQuestions[0].answers[0].text).click(); // Click the correct answer
    cy.contains(mockQuestions[1].question).should("be.visible"); // Increase timeout if needed
  });

  it("shows the final score and allows restarting after completing the quiz", () => {
    cy.intercept("GET", "/api/questions/random", mockQuestions).as(
      "getQuestions"
    );
    mount(<Quiz />);

    cy.contains("Start Quiz").click();
    cy.wait("@getQuestions");

    // Loop through each question and select the first answer marked as correct
    mockQuestions.forEach((question) => {
      cy.get("[data-cy=quiz-question]")
        .eq(question.answers.findIndex((a) => a.isCorrect))
        .click(); // Click the correct answer based on its position
    });

    // Assert that the score and completion message is visible
    cy.contains(
      `Your score: ${mockQuestions.length}/${mockQuestions.length}`
    ).should("be.visible");

    // Click the "Take New Quiz" button to restart
    cy.contains("Take New Quiz").click();
  });
});
