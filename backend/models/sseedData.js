const mongoose = require('mongoose');
const Quiz = require('./Quiz');

const seedQuizzes = async () => {
  const quizzes = [
    {
      title: "Substance Abuse Basics",
      category: "Education",
      difficulty: "Beginner",
      language: "english",
      questions: [
        {
          question: "What is the most common reason adolescents start using substances?",
          options: [
            "Peer pressure",
            "Academic stress", 
            "Family problems",
            "Curiosity"
          ],
          correctAnswer: 0,
          explanation: "Peer pressure is the most common factor, where young people feel compelled to fit in with their social group."
        },
        {
          question: "Which substance is most commonly abused by Indian youth?",
          options: [
            "Tobacco",
            "Alcohol",
            "Marijuana",
            "Prescription drugs"
          ],
          correctAnswer: 0,
          explanation: "Tobacco, in forms like cigarettes and gutka, is the most commonly abused substance among Indian youth."
        }
      ]
    }
  ];

  await Quiz.deleteMany({});
  await Quiz.insertMany(quizzes);
  console.log('Sample quizzes added!');
};

module.exports = seedQuizzes;