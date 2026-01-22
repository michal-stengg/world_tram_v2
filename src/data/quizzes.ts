/**
 * Quiz data for World Tram game
 *
 * Each country has a quiz with 3 questions about geography,
 * culture, and landmarks. Questions include fun facts for learning.
 */

import type { CountryQuiz } from '../types';

/**
 * All quizzes in the game, one per country
 */
export const quizzes: CountryQuiz[] = [
  // France
  {
    id: 'quiz-france',
    countryId: 'france',
    name: 'France',
    questions: [
      {
        id: 'france-q1',
        questionText: 'What is the famous tower in Paris?',
        options: ['Eiffel Tower', 'Big Ben', 'Leaning Tower', 'Empire State'],
        correctAnswer: 'Eiffel Tower',
        funFact: 'The Eiffel Tower was built in 1889 and is 330 meters tall!',
      },
      {
        id: 'france-q2',
        questionText: 'What pastry is France famous for?',
        options: ['Croissants', 'Tacos', 'Sushi', 'Hamburgers'],
        correctAnswer: 'Croissants',
        funFact: "Croissants get their name from the French word for 'crescent'!",
      },
      {
        id: 'france-q3',
        questionText: 'What language do people speak in France?',
        options: ['French', 'Spanish', 'German', 'Italian'],
        correctAnswer: 'French',
        funFact: 'French is spoken by over 275 million people worldwide!',
      },
    ],
  },

  // Germany
  {
    id: 'quiz-germany',
    countryId: 'germany',
    name: 'Germany',
    questions: [
      {
        id: 'germany-q1',
        questionText: 'What is Germany famous for making?',
        options: ['Cars', 'Surfboards', 'Kimonos', 'Sombreros'],
        correctAnswer: 'Cars',
        funFact: 'Germany is home to famous car brands like BMW, Mercedes, and Volkswagen!',
      },
      {
        id: 'germany-q2',
        questionText: 'What candy did Germany invent?',
        options: ['Gummy bears', 'Chocolate chip cookies', 'Bubble gum', 'Cotton candy'],
        correctAnswer: 'Gummy bears',
        funFact: 'Haribo invented gummy bears in Germany in 1922!',
      },
      {
        id: 'germany-q3',
        questionText: 'What famous forest is in Germany?',
        options: ['Black Forest', 'Amazon', 'Sherwood', 'Redwood'],
        correctAnswer: 'Black Forest',
        funFact: 'The Black Forest is famous for cuckoo clocks and cake!',
      },
    ],
  },

  // Russia
  {
    id: 'quiz-russia',
    countryId: 'russia',
    name: 'Russia',
    questions: [
      {
        id: 'russia-q1',
        questionText: 'What are Russian nesting dolls called?',
        options: ['Matryoshka', 'Babushka', 'Kokeshi', 'Origami'],
        correctAnswer: 'Matryoshka',
        funFact: 'Matryoshka dolls represent mothers and children!',
      },
      {
        id: 'russia-q2',
        questionText: "What is the world's biggest country?",
        options: ['Russia', 'China', 'Canada', 'USA'],
        correctAnswer: 'Russia',
        funFact: 'Russia spans 11 time zones!',
      },
      {
        id: 'russia-q3',
        questionText: 'What famous building is in Moscow?',
        options: ["St. Basil's Cathedral", 'Taj Mahal', 'Colosseum', 'Big Ben'],
        correctAnswer: "St. Basil's Cathedral",
        funFact: "St. Basil's colorful domes represent flames from a bonfire!",
      },
    ],
  },

  // China
  {
    id: 'quiz-china',
    countryId: 'china',
    name: 'China',
    questions: [
      {
        id: 'china-q1',
        questionText: 'What wall can you see from space?',
        options: ['Great Wall of China', 'Berlin Wall', 'Wall Street', 'None'],
        correctAnswer: 'Great Wall of China',
        funFact: 'The Great Wall is over 13,000 miles long!',
      },
      {
        id: 'china-q2',
        questionText: "What animal is China's national treasure?",
        options: ['Giant Panda', 'Tiger', 'Dragon', 'Lion'],
        correctAnswer: 'Giant Panda',
        funFact: 'Pandas eat up to 38 kg of bamboo every day!',
      },
      {
        id: 'china-q3',
        questionText: 'What did China invent for celebrations?',
        options: ['Fireworks', 'Balloons', 'Candles', 'Confetti'],
        correctAnswer: 'Fireworks',
        funFact: 'Fireworks were invented in China over 2,000 years ago!',
      },
    ],
  },

  // Japan
  {
    id: 'quiz-japan',
    countryId: 'japan',
    name: 'Japan',
    questions: [
      {
        id: 'japan-q1',
        questionText: 'What famous mountain is in Japan?',
        options: ['Mount Fuji', 'Mount Everest', 'Mount Kilimanjaro', 'Alps'],
        correctAnswer: 'Mount Fuji',
        funFact: 'Mount Fuji is actually a volcano that last erupted in 1707!',
      },
      {
        id: 'japan-q2',
        questionText: 'What flower festival does Japan celebrate?',
        options: ['Cherry blossoms', 'Roses', 'Tulips', 'Sunflowers'],
        correctAnswer: 'Cherry blossoms',
        funFact: "Cherry blossom viewing is called 'Hanami' in Japanese!",
      },
      {
        id: 'japan-q3',
        questionText: 'What fast train is Japan famous for?',
        options: ['Bullet trains', 'Steam trains', 'Cable cars', 'Monorails'],
        correctAnswer: 'Bullet trains',
        funFact: 'Japanese bullet trains can travel up to 320 km/h!',
      },
    ],
  },

  // Singapore
  {
    id: 'quiz-singapore',
    countryId: 'singapore',
    name: 'Singapore',
    questions: [
      {
        id: 'singapore-q1',
        questionText: "What is Singapore's famous lion-fish statue?",
        options: ['Merlion', 'Mercat', 'Merbear', 'Merdog'],
        correctAnswer: 'Merlion',
        funFact: 'The Merlion spouts water from its mouth into the harbor!',
      },
      {
        id: 'singapore-q2',
        questionText: 'What is Singapore known for being?',
        options: ['Very clean', 'Very cold', 'Very big', 'Very old'],
        correctAnswer: 'Very clean',
        funFact: 'Singapore has strict laws to keep the city super clean!',
      },
      {
        id: 'singapore-q3',
        questionText: 'What unique garden attraction does Singapore have?',
        options: ['Gardens with Supertrees', 'Underground caves', 'Ice castles', 'Desert dunes'],
        correctAnswer: 'Gardens with Supertrees',
        funFact: 'The Supertrees are up to 50 meters tall and collect rainwater!',
      },
    ],
  },

  // Australia
  {
    id: 'quiz-australia',
    countryId: 'australia',
    name: 'Australia',
    questions: [
      {
        id: 'australia-q1',
        questionText: 'What animal is famous in Australia?',
        options: ['Kangaroo', 'Elephant', 'Lion', 'Bear'],
        correctAnswer: 'Kangaroo',
        funFact: "Baby kangaroos are called joeys and live in their mom's pouch!",
      },
      {
        id: 'australia-q2',
        questionText: 'What famous building is in Sydney?',
        options: ['Opera House', 'Eiffel Tower', 'Big Ben', 'Colosseum'],
        correctAnswer: 'Opera House',
        funFact: 'The Sydney Opera House has over 1 million roof tiles!',
      },
      {
        id: 'australia-q3',
        questionText: 'What big red rock is in Australia?',
        options: ['Uluru', 'Grand Canyon', 'Stone Henge', "Giant's Causeway"],
        correctAnswer: 'Uluru',
        funFact: 'Uluru is sacred to Aboriginal Australians and changes color at sunset!',
      },
    ],
  },

  // Brazil
  {
    id: 'quiz-brazil',
    countryId: 'brazil',
    name: 'Brazil',
    questions: [
      {
        id: 'brazil-q1',
        questionText: 'What rainforest is in Brazil?',
        options: ['Amazon', 'Sahara', 'Congo', 'Taiga'],
        correctAnswer: 'Amazon',
        funFact: "The Amazon produces 20% of Earth's oxygen!",
      },
      {
        id: 'brazil-q2',
        questionText: 'What famous festival does Brazil have?',
        options: ['Rio Carnival', 'Oktoberfest', 'Diwali', 'Chinese New Year'],
        correctAnswer: 'Rio Carnival',
        funFact: 'Rio Carnival has over 2 million people on the streets each day!',
      },
      {
        id: 'brazil-q3',
        questionText: 'What sport is Brazil most famous for?',
        options: ['Soccer', 'Baseball', 'Cricket', 'Hockey'],
        correctAnswer: 'Soccer',
        funFact: 'Brazil has won the FIFA World Cup 5 times, more than any other country!',
      },
    ],
  },

  // Canada
  {
    id: 'quiz-canada',
    countryId: 'canada',
    name: 'Canada',
    questions: [
      {
        id: 'canada-q1',
        questionText: "What leaf is on Canada's flag?",
        options: ['Maple leaf', 'Oak leaf', 'Palm leaf', 'Fern leaf'],
        correctAnswer: 'Maple leaf',
        funFact: "Maple syrup comes from maple trees - Canada makes 71% of the world's supply!",
      },
      {
        id: 'canada-q2',
        questionText: 'What famous waterfall is between Canada and USA?',
        options: ['Niagara Falls', 'Victoria Falls', 'Angel Falls', 'Iguazu Falls'],
        correctAnswer: 'Niagara Falls',
        funFact: 'Niagara Falls is actually three waterfalls combined!',
      },
      {
        id: 'canada-q3',
        questionText: "What animal is Canada's national symbol?",
        options: ['Beaver', 'Moose', 'Bear', 'Goose'],
        correctAnswer: 'Beaver',
        funFact: 'Beavers build dams that can be seen from space!',
      },
    ],
  },

  // USA
  {
    id: 'quiz-usa',
    countryId: 'usa',
    name: 'USA',
    questions: [
      {
        id: 'usa-q1',
        questionText: 'What statue welcomes visitors to New York?',
        options: ['Statue of Liberty', 'Statue of David', 'Christ the Redeemer', 'Venus de Milo'],
        correctAnswer: 'Statue of Liberty',
        funFact: 'The Statue of Liberty was a gift from France in 1886!',
      },
      {
        id: 'usa-q2',
        questionText: "What mountain has presidents' faces carved on it?",
        options: ['Mount Rushmore', 'Mount Everest', 'Mount Fuji', 'Mount McKinley'],
        correctAnswer: 'Mount Rushmore',
        funFact: "It took 14 years to carve the four presidents' faces!",
      },
      {
        id: 'usa-q3',
        questionText: 'What snack is popular at American movies?',
        options: ['Popcorn', 'Sushi', 'Pizza', 'Tacos'],
        correctAnswer: 'Popcorn',
        funFact: 'Americans eat about 17 billion quarts of popcorn per year!',
      },
    ],
  },
];

/**
 * Get a quiz by its country ID
 * @param countryId - The country ID to search for
 * @returns The quiz if found, undefined otherwise
 */
export function getQuizByCountryId(countryId: string): CountryQuiz | undefined {
  return quizzes.find((quiz) => quiz.countryId === countryId);
}
