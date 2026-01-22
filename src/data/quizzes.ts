/**
 * Quiz data for World Tram game
 *
 * Each country has a question bank of 20 questions about geography,
 * culture, and landmarks. 3 random questions are drawn for each quiz.
 */

import type { CountryQuiz, QuizQuestion } from '../types';

/**
 * Question banks for each country (20 questions each)
 */
const questionBanks: Record<string, QuizQuestion[]> = {
  france: [
    { id: 'france-q1', questionText: 'What is the famous tower in Paris?', options: ['Eiffel Tower', 'Big Ben', 'Leaning Tower', 'Empire State'], correctAnswer: 'Eiffel Tower', funFact: 'The Eiffel Tower was built in 1889 and is 330 meters tall!' },
    { id: 'france-q2', questionText: 'What pastry is France famous for?', options: ['Croissants', 'Tacos', 'Sushi', 'Hamburgers'], correctAnswer: 'Croissants', funFact: "Croissants get their name from the French word for 'crescent'!" },
    { id: 'france-q3', questionText: 'What language do people speak in France?', options: ['French', 'Spanish', 'German', 'Italian'], correctAnswer: 'French', funFact: 'French is spoken by over 275 million people worldwide!' },
    { id: 'france-q4', questionText: 'What famous museum is in Paris?', options: ['The Louvre', 'The Met', 'British Museum', 'Prado'], correctAnswer: 'The Louvre', funFact: 'The Louvre is the largest art museum in the world!' },
    { id: 'france-q5', questionText: 'What river flows through Paris?', options: ['Seine', 'Thames', 'Nile', 'Amazon'], correctAnswer: 'Seine', funFact: 'The Seine River is 776 km long and has 37 bridges in Paris!' },
    { id: 'france-q6', questionText: 'What famous painting is in the Louvre?', options: ['Mona Lisa', 'Starry Night', 'The Scream', 'Girl with Pearl'], correctAnswer: 'Mona Lisa', funFact: 'The Mona Lisa is protected by bulletproof glass!' },
    { id: 'france-q7', questionText: 'What cheese is France famous for?', options: ['Brie', 'Cheddar', 'Mozzarella', 'Feta'], correctAnswer: 'Brie', funFact: 'France produces over 1,000 different types of cheese!' },
    { id: 'france-q8', questionText: 'What famous race happens in France each July?', options: ['Tour de France', 'Monaco GP', 'Paris Marathon', 'Le Mans'], correctAnswer: 'Tour de France', funFact: 'The Tour de France is about 3,500 km long!' },
    { id: 'france-q9', questionText: 'What is the capital of France?', options: ['Paris', 'Lyon', 'Marseille', 'Nice'], correctAnswer: 'Paris', funFact: 'Paris is called the City of Light because it was a center of education!' },
    { id: 'france-q10', questionText: 'What colors are on the French flag?', options: ['Blue, white, red', 'Green, white, red', 'Red, yellow, blue', 'Black, red, gold'], correctAnswer: 'Blue, white, red', funFact: 'The French flag is called the Tricolore!' },
    { id: 'france-q11', questionText: 'What thin pancake is popular in France?', options: ['Crepe', 'Waffle', 'Pancake', 'Tortilla'], correctAnswer: 'Crepe', funFact: 'Crepes originated in Brittany, a region in northwest France!' },
    { id: 'france-q12', questionText: 'What palace did French kings live in?', options: ['Versailles', 'Buckingham', 'Windsor', 'Schonbrunn'], correctAnswer: 'Versailles', funFact: 'Versailles has over 2,000 windows and 700 rooms!' },
    { id: 'france-q13', questionText: 'What long bread is France known for?', options: ['Baguette', 'Ciabatta', 'Naan', 'Pita'], correctAnswer: 'Baguette', funFact: 'French law says baguettes can only contain flour, water, salt, and yeast!' },
    { id: 'france-q14', questionText: 'What French word means goodbye?', options: ['Au revoir', 'Bonjour', 'Merci', 'Oui'], correctAnswer: 'Au revoir', funFact: "Au revoir literally means 'until we see again'!" },
    { id: 'france-q15', questionText: 'What island is a French territory in the Pacific?', options: ['Tahiti', 'Hawaii', 'Fiji', 'Guam'], correctAnswer: 'Tahiti', funFact: 'Tahiti is known for its beautiful black pearl jewelry!' },
    { id: 'france-q16', questionText: 'What onion soup is a French specialty?', options: ['French onion soup', 'Miso soup', 'Tomato soup', 'Chicken soup'], correctAnswer: 'French onion soup', funFact: 'French onion soup is topped with melted cheese on bread!' },
    { id: 'france-q17', questionText: 'What fashion capital is France home to?', options: ['Paris', 'Milan', 'New York', 'London'], correctAnswer: 'Paris', funFact: 'Paris Fashion Week happens twice a year!' },
    { id: 'france-q18', questionText: 'What mountain range borders France and Spain?', options: ['Pyrenees', 'Alps', 'Rockies', 'Andes'], correctAnswer: 'Pyrenees', funFact: 'The Pyrenees stretch for about 430 km!' },
    { id: 'france-q19', questionText: 'What snails do French people eat?', options: ['Escargot', 'Garden snails', 'Sea snails', 'Slugs'], correctAnswer: 'Escargot', funFact: 'French people eat about 40,000 tons of snails per year!' },
    { id: 'france-q20', questionText: 'What comic book character is French?', options: ['Asterix', 'Tintin', 'Superman', 'Batman'], correctAnswer: 'Asterix', funFact: 'Asterix has been translated into over 100 languages!' },
  ],
  germany: [
    { id: 'germany-q1', questionText: 'What is Germany famous for making?', options: ['Cars', 'Surfboards', 'Kimonos', 'Sombreros'], correctAnswer: 'Cars', funFact: 'Germany is home to famous car brands like BMW, Mercedes, and Volkswagen!' },
    { id: 'germany-q2', questionText: 'What candy did Germany invent?', options: ['Gummy bears', 'Chocolate chip cookies', 'Bubble gum', 'Cotton candy'], correctAnswer: 'Gummy bears', funFact: 'Haribo invented gummy bears in Germany in 1922!' },
    { id: 'germany-q3', questionText: 'What famous forest is in Germany?', options: ['Black Forest', 'Amazon', 'Sherwood', 'Redwood'], correctAnswer: 'Black Forest', funFact: 'The Black Forest is famous for cuckoo clocks and cake!' },
    { id: 'germany-q4', questionText: 'What is the capital of Germany?', options: ['Berlin', 'Munich', 'Hamburg', 'Frankfurt'], correctAnswer: 'Berlin', funFact: 'Berlin has more bridges than Venice!' },
    { id: 'germany-q5', questionText: 'What famous wall divided Germany?', options: ['Berlin Wall', 'Great Wall', 'Hadrian Wall', 'Wall Street'], correctAnswer: 'Berlin Wall', funFact: 'The Berlin Wall fell in 1989 after 28 years!' },
    { id: 'germany-q6', questionText: 'What festival does Germany celebrate in fall?', options: ['Oktoberfest', 'Carnival', 'Diwali', 'Thanksgiving'], correctAnswer: 'Oktoberfest', funFact: 'Oktoberfest actually starts in September!' },
    { id: 'germany-q7', questionText: 'What sausage is Germany famous for?', options: ['Bratwurst', 'Hot dog', 'Chorizo', 'Salami'], correctAnswer: 'Bratwurst', funFact: 'There are over 40 types of bratwurst in Germany!' },
    { id: 'germany-q8', questionText: 'What soft twisted bread is German?', options: ['Pretzel', 'Bagel', 'Baguette', 'Croissant'], correctAnswer: 'Pretzel', funFact: 'Pretzels were invented by German monks!' },
    { id: 'germany-q9', questionText: 'What famous composer was German?', options: ['Beethoven', 'Mozart', 'Chopin', 'Vivaldi'], correctAnswer: 'Beethoven', funFact: 'Beethoven continued composing even after becoming deaf!' },
    { id: 'germany-q10', questionText: 'What fairy tale writers were German?', options: ['Brothers Grimm', 'Hans Andersen', 'Charles Perrault', 'Aesop'], correctAnswer: 'Brothers Grimm', funFact: 'The Grimm brothers collected over 200 folk tales!' },
    { id: 'germany-q11', questionText: 'What castle inspired Disney?', options: ['Neuschwanstein', 'Windsor', 'Edinburgh', 'Prague'], correctAnswer: 'Neuschwanstein', funFact: 'Neuschwanstein means New Swan Stone Castle!' },
    { id: 'germany-q12', questionText: 'What colors are on the German flag?', options: ['Black, red, gold', 'Red, white, blue', 'Green, white, red', 'Blue, yellow'], correctAnswer: 'Black, red, gold', funFact: 'These colors date back to the 1800s!' },
    { id: 'germany-q13', questionText: 'What river flows through Germany?', options: ['Rhine', 'Seine', 'Thames', 'Danube only'], correctAnswer: 'Rhine', funFact: 'The Rhine has many castles along its banks!' },
    { id: 'germany-q14', questionText: 'What sport is popular in Germany?', options: ['Soccer', 'Baseball', 'Cricket', 'Rugby'], correctAnswer: 'Soccer', funFact: 'Germany has won the FIFA World Cup 4 times!' },
    { id: 'germany-q15', questionText: 'What Christmas tradition came from Germany?', options: ['Christmas trees', 'Santa Claus', 'Stockings', 'Candy canes'], correctAnswer: 'Christmas trees', funFact: 'The tradition of Christmas trees started in Germany in the 16th century!' },
    { id: 'germany-q16', questionText: 'What did Germany invent for printing?', options: ['Printing press', 'Typewriter', 'Computer', 'Pen'], correctAnswer: 'Printing press', funFact: 'Gutenberg invented the printing press around 1440!' },
    { id: 'germany-q17', questionText: 'What cake comes from the Black Forest?', options: ['Black Forest cake', 'Cheesecake', 'Pound cake', 'Carrot cake'], correctAnswer: 'Black Forest cake', funFact: 'Black Forest cake has cherries and chocolate!' },
    { id: 'germany-q18', questionText: 'What German word means thank you?', options: ['Danke', 'Bitte', 'Hallo', 'Tschuss'], correctAnswer: 'Danke', funFact: "Danke schon means 'thank you very much'!" },
    { id: 'germany-q19', questionText: 'What famous scientist was German?', options: ['Albert Einstein', 'Isaac Newton', 'Galileo', 'Darwin'], correctAnswer: 'Albert Einstein', funFact: 'Einstein developed the theory of relativity!' },
    { id: 'germany-q20', questionText: 'What type of dog breed is German?', options: ['German Shepherd', 'Bulldog', 'Poodle', 'Labrador'], correctAnswer: 'German Shepherd', funFact: 'German Shepherds are often used as police dogs!' },
  ],
  russia: [
    { id: 'russia-q1', questionText: 'What are Russian nesting dolls called?', options: ['Matryoshka', 'Babushka', 'Kokeshi', 'Origami'], correctAnswer: 'Matryoshka', funFact: 'Matryoshka dolls represent mothers and children!' },
    { id: 'russia-q2', questionText: "What is the world's biggest country?", options: ['Russia', 'China', 'Canada', 'USA'], correctAnswer: 'Russia', funFact: 'Russia spans 11 time zones!' },
    { id: 'russia-q3', questionText: 'What famous building is in Moscow?', options: ["St. Basil's Cathedral", 'Taj Mahal', 'Colosseum', 'Big Ben'], correctAnswer: "St. Basil's Cathedral", funFact: "St. Basil's colorful domes represent flames from a bonfire!" },
    { id: 'russia-q4', questionText: 'What is the capital of Russia?', options: ['Moscow', 'St. Petersburg', 'Kiev', 'Minsk'], correctAnswer: 'Moscow', funFact: 'Moscow is home to over 12 million people!' },
    { id: 'russia-q5', questionText: 'What Russian soup is made with beets?', options: ['Borscht', 'Miso', 'Minestrone', 'Gazpacho'], correctAnswer: 'Borscht', funFact: 'Borscht is bright purple-red from the beets!' },
    { id: 'russia-q6', questionText: 'What ballet is Russia famous for?', options: ['Swan Lake', 'Cats', 'Hamilton', 'Phantom'], correctAnswer: 'Swan Lake', funFact: 'Tchaikovsky composed Swan Lake in 1876!' },
    { id: 'russia-q7', questionText: 'What animal is a symbol of Russia?', options: ['Bear', 'Eagle', 'Lion', 'Dragon'], correctAnswer: 'Bear', funFact: 'The Russian bear symbolizes strength and power!' },
    { id: 'russia-q8', questionText: 'What frozen lake is the deepest in the world?', options: ['Lake Baikal', 'Lake Superior', 'Lake Victoria', 'Caspian Sea'], correctAnswer: 'Lake Baikal', funFact: 'Lake Baikal contains 20% of the worlds unfrozen fresh water!' },
    { id: 'russia-q9', questionText: 'What Russian tea urn is traditional?', options: ['Samovar', 'Teapot', 'Kettle', 'Urn'], correctAnswer: 'Samovar', funFact: 'Samovars kept tea warm for hours!' },
    { id: 'russia-q10', questionText: 'What space station did Russia help build?', options: ['ISS', 'Hubble', 'Skylab', 'Mir only'], correctAnswer: 'ISS', funFact: 'Russia launched the first human into space in 1961!' },
    { id: 'russia-q11', questionText: 'What Russian alphabet has 33 letters?', options: ['Cyrillic', 'Latin', 'Greek', 'Arabic'], correctAnswer: 'Cyrillic', funFact: 'Cyrillic was created by two monks named Cyril and Methodius!' },
    { id: 'russia-q12', questionText: 'What palace is in St. Petersburg?', options: ['Winter Palace', 'Summer Palace', 'Crystal Palace', 'Forbidden City'], correctAnswer: 'Winter Palace', funFact: 'The Winter Palace has 1,057 rooms!' },
    { id: 'russia-q13', questionText: 'What train crosses all of Russia?', options: ['Trans-Siberian', 'Orient Express', 'Eurostar', 'Bullet Train'], correctAnswer: 'Trans-Siberian', funFact: 'The Trans-Siberian Railway is 9,289 km long!' },
    { id: 'russia-q14', questionText: 'What Russian dance involves squatting?', options: ['Hopak', 'Waltz', 'Tango', 'Salsa'], correctAnswer: 'Hopak', funFact: 'The squatting dance requires great leg strength!' },
    { id: 'russia-q15', questionText: 'What Russian dumplings are popular?', options: ['Pelmeni', 'Gyoza', 'Ravioli', 'Empanadas'], correctAnswer: 'Pelmeni', funFact: 'Pelmeni are traditionally filled with meat!' },
    { id: 'russia-q16', questionText: 'What precious stone is Russia famous for?', options: ['Amber', 'Diamond', 'Ruby', 'Sapphire'], correctAnswer: 'Amber', funFact: 'Russia has an entire room made of amber panels!' },
    { id: 'russia-q17', questionText: 'What Russian word means fortress?', options: ['Kremlin', 'Castle', 'Palace', 'Tower'], correctAnswer: 'Kremlin', funFact: 'The Moscow Kremlin is over 500 years old!' },
    { id: 'russia-q18', questionText: 'What chess champion was Russian?', options: ['Garry Kasparov', 'Bobby Fischer', 'Magnus Carlsen', 'Deep Blue'], correctAnswer: 'Garry Kasparov', funFact: 'Kasparov became world champion at age 22!' },
    { id: 'russia-q19', questionText: 'What pancakes are Russian?', options: ['Blini', 'Crepes', 'Pancakes', 'Waffles'], correctAnswer: 'Blini', funFact: 'Blini are often served with sour cream and caviar!' },
    { id: 'russia-q20', questionText: 'What writer wrote War and Peace?', options: ['Leo Tolstoy', 'Dostoevsky', 'Pushkin', 'Chekhov'], correctAnswer: 'Leo Tolstoy', funFact: 'War and Peace has over 1,200 pages!' },
  ],
  china: [
    { id: 'china-q1', questionText: 'What wall can you see from space?', options: ['Great Wall of China', 'Berlin Wall', 'Wall Street', 'None'], correctAnswer: 'Great Wall of China', funFact: 'The Great Wall is over 13,000 miles long!' },
    { id: 'china-q2', questionText: "What animal is China's national treasure?", options: ['Giant Panda', 'Tiger', 'Dragon', 'Lion'], correctAnswer: 'Giant Panda', funFact: 'Pandas eat up to 38 kg of bamboo every day!' },
    { id: 'china-q3', questionText: 'What did China invent for celebrations?', options: ['Fireworks', 'Balloons', 'Candles', 'Confetti'], correctAnswer: 'Fireworks', funFact: 'Fireworks were invented in China over 2,000 years ago!' },
    { id: 'china-q4', questionText: 'What is the capital of China?', options: ['Beijing', 'Shanghai', 'Hong Kong', 'Tokyo'], correctAnswer: 'Beijing', funFact: "Beijing means 'Northern Capital' in Chinese!" },
    { id: 'china-q5', questionText: 'What utensils do Chinese people use?', options: ['Chopsticks', 'Forks', 'Spoons only', 'Hands'], correctAnswer: 'Chopsticks', funFact: 'Chopsticks have been used for over 3,000 years!' },
    { id: 'china-q6', questionText: 'What clay army was found in China?', options: ['Terracotta Warriors', 'Stone Soldiers', 'Bronze Army', 'Iron Guards'], correctAnswer: 'Terracotta Warriors', funFact: 'There are over 8,000 terracotta soldiers!' },
    { id: 'china-q7', questionText: 'What drink did China invent?', options: ['Tea', 'Coffee', 'Soda', 'Juice'], correctAnswer: 'Tea', funFact: 'Tea was discovered in China nearly 5,000 years ago!' },
    { id: 'china-q8', questionText: 'What martial art originated in China?', options: ['Kung Fu', 'Karate', 'Taekwondo', 'Judo'], correctAnswer: 'Kung Fu', funFact: 'Kung Fu was developed by Shaolin monks!' },
    { id: 'china-q9', questionText: 'What writing system does China use?', options: ['Characters', 'Alphabet', 'Hieroglyphs', 'Runes'], correctAnswer: 'Characters', funFact: 'There are over 50,000 Chinese characters!' },
    { id: 'china-q10', questionText: 'What Chinese New Year animal changes yearly?', options: ['Zodiac animals', 'Dragon only', 'Phoenix', 'Unicorn'], correctAnswer: 'Zodiac animals', funFact: 'There are 12 animals in the Chinese zodiac!' },
    { id: 'china-q11', questionText: 'What palace is in Beijing?', options: ['Forbidden City', 'Buckingham', 'Versailles', 'Winter Palace'], correctAnswer: 'Forbidden City', funFact: 'The Forbidden City has 9,999 rooms!' },
    { id: 'china-q12', questionText: 'What river is the longest in China?', options: ['Yangtze', 'Yellow River', 'Mekong', 'Ganges'], correctAnswer: 'Yangtze', funFact: 'The Yangtze is the third longest river in the world!' },
    { id: 'china-q13', questionText: 'What did China invent for writing?', options: ['Paper', 'Pencils', 'Ink', 'Pens'], correctAnswer: 'Paper', funFact: 'Paper was invented in China around 105 AD!' },
    { id: 'china-q14', questionText: 'What noodle dish is Chinese?', options: ['Lo Mein', 'Spaghetti', 'Ramen', 'Pho'], correctAnswer: 'Lo Mein', funFact: "Lo Mein means 'tossed noodles' in Cantonese!" },
    { id: 'china-q15', questionText: 'What compass did China invent?', options: ['Magnetic compass', 'Star compass', 'Sun compass', 'GPS'], correctAnswer: 'Magnetic compass', funFact: 'The compass was invented in China around 200 BC!' },
    { id: 'china-q16', questionText: 'What fabric did China keep secret?', options: ['Silk', 'Cotton', 'Wool', 'Linen'], correctAnswer: 'Silk', funFact: 'Revealing silk secrets was once punishable by death!' },
    { id: 'china-q17', questionText: 'What dumpling is popular in China?', options: ['Dim Sum', 'Pierogi', 'Gyoza', 'Empanada'], correctAnswer: 'Dim Sum', funFact: "Dim Sum means 'touch the heart'!" },
    { id: 'china-q18', questionText: 'What creature is lucky in China?', options: ['Dragon', 'Cat', 'Owl', 'Crow'], correctAnswer: 'Dragon', funFact: 'Chinese dragons are symbols of power and good luck!' },
    { id: 'china-q19', questionText: 'What Chinese game uses tiles?', options: ['Mahjong', 'Chess', 'Checkers', 'Go'], correctAnswer: 'Mahjong', funFact: 'Mahjong was invented during the Qing dynasty!' },
    { id: 'china-q20', questionText: 'What tower is in Shanghai?', options: ['Oriental Pearl Tower', 'CN Tower', 'Tokyo Tower', 'Eiffel Tower'], correctAnswer: 'Oriental Pearl Tower', funFact: 'The Oriental Pearl Tower has 11 spheres!' },
  ],
  japan: [
    { id: 'japan-q1', questionText: 'What famous mountain is in Japan?', options: ['Mount Fuji', 'Mount Everest', 'Mount Kilimanjaro', 'Alps'], correctAnswer: 'Mount Fuji', funFact: 'Mount Fuji is actually a volcano that last erupted in 1707!' },
    { id: 'japan-q2', questionText: 'What flower festival does Japan celebrate?', options: ['Cherry blossoms', 'Roses', 'Tulips', 'Sunflowers'], correctAnswer: 'Cherry blossoms', funFact: "Cherry blossom viewing is called 'Hanami' in Japanese!" },
    { id: 'japan-q3', questionText: 'What fast train is Japan famous for?', options: ['Bullet trains', 'Steam trains', 'Cable cars', 'Monorails'], correctAnswer: 'Bullet trains', funFact: 'Japanese bullet trains can travel up to 320 km/h!' },
    { id: 'japan-q4', questionText: 'What is the capital of Japan?', options: ['Tokyo', 'Kyoto', 'Osaka', 'Hiroshima'], correctAnswer: 'Tokyo', funFact: 'Tokyo is the most populous city in the world!' },
    { id: 'japan-q5', questionText: 'What raw fish dish is Japanese?', options: ['Sushi', 'Fish and chips', 'Ceviche', 'Lox'], correctAnswer: 'Sushi', funFact: 'Sushi actually refers to the seasoned rice, not the fish!' },
    { id: 'japan-q6', questionText: 'What paper folding art is Japanese?', options: ['Origami', 'Kirigami', 'Quilling', 'Decoupage'], correctAnswer: 'Origami', funFact: "Origami means 'folding paper' in Japanese!" },
    { id: 'japan-q7', questionText: 'What wrestling sport is Japanese?', options: ['Sumo', 'Boxing', 'MMA', 'Judo only'], correctAnswer: 'Sumo', funFact: 'Sumo wrestlers can weigh over 200 kg!' },
    { id: 'japan-q8', questionText: 'What robe do Japanese people wear?', options: ['Kimono', 'Sari', 'Hanbok', 'Toga'], correctAnswer: 'Kimono', funFact: "Kimono means 'thing to wear' in Japanese!" },
    { id: 'japan-q9', questionText: 'What cartoon style is Japanese?', options: ['Anime', 'Comics', 'Cartoons', 'Animation'], correctAnswer: 'Anime', funFact: 'Japan produces about 60% of all animated shows!' },
    { id: 'japan-q10', questionText: 'What video game company is Japanese?', options: ['Nintendo', 'Xbox', 'Atari', 'EA'], correctAnswer: 'Nintendo', funFact: 'Nintendo started as a playing card company in 1889!' },
    { id: 'japan-q11', questionText: 'What soup is eaten with sushi?', options: ['Miso soup', 'Chicken soup', 'Tomato soup', 'Onion soup'], correctAnswer: 'Miso soup', funFact: 'Miso soup is made from fermented soybean paste!' },
    { id: 'japan-q12', questionText: 'What garden style is Japanese?', options: ['Zen garden', 'English garden', 'French garden', 'Tropical garden'], correctAnswer: 'Zen garden', funFact: 'Zen gardens use rocks and sand to represent water!' },
    { id: 'japan-q13', questionText: 'What warrior class was in Japan?', options: ['Samurai', 'Knights', 'Vikings', 'Spartans'], correctAnswer: 'Samurai', funFact: 'Samurai followed a code called Bushido!' },
    { id: 'japan-q14', questionText: 'What noodle soup is Japanese?', options: ['Ramen', 'Pho', 'Laksa', 'Minestrone'], correctAnswer: 'Ramen', funFact: 'There are over 30,000 ramen shops in Japan!' },
    { id: 'japan-q15', questionText: 'What hot spring baths are Japanese?', options: ['Onsen', 'Sauna', 'Steam room', 'Hot tub'], correctAnswer: 'Onsen', funFact: 'Japan has over 27,000 hot spring locations!' },
    { id: 'japan-q16', questionText: 'What shrine gate is red in Japan?', options: ['Torii', 'Pagoda', 'Temple', 'Arch'], correctAnswer: 'Torii', funFact: 'Torii gates mark the entrance to sacred spaces!' },
    { id: 'japan-q17', questionText: 'What tiny tree art is Japanese?', options: ['Bonsai', 'Topiary', 'Ikebana', 'Terrarium'], correctAnswer: 'Bonsai', funFact: 'Some bonsai trees are over 1,000 years old!' },
    { id: 'japan-q18', questionText: 'What Japanese hello is polite?', options: ['Konnichiwa', 'Sayonara', 'Arigato', 'Hai'], correctAnswer: 'Konnichiwa', funFact: "Konnichiwa literally means 'this day'!" },
    { id: 'japan-q19', questionText: 'What green tea is from Japan?', options: ['Matcha', 'Earl Grey', 'Chai', 'Oolong'], correctAnswer: 'Matcha', funFact: 'Matcha is made from specially grown green tea leaves!' },
    { id: 'japan-q20', questionText: 'What robot cat is a Japanese character?', options: ['Doraemon', 'Hello Kitty', 'Pikachu', 'Totoro'], correctAnswer: 'Doraemon', funFact: 'Doraemon has a 4D pocket with amazing gadgets!' },
  ],
  singapore: [
    { id: 'singapore-q1', questionText: "What is Singapore's famous lion-fish statue?", options: ['Merlion', 'Mercat', 'Merbear', 'Merdog'], correctAnswer: 'Merlion', funFact: 'The Merlion spouts water from its mouth into the harbor!' },
    { id: 'singapore-q2', questionText: 'What is Singapore known for being?', options: ['Very clean', 'Very cold', 'Very big', 'Very old'], correctAnswer: 'Very clean', funFact: 'Singapore has strict laws to keep the city super clean!' },
    { id: 'singapore-q3', questionText: 'What unique garden attraction does Singapore have?', options: ['Gardens with Supertrees', 'Underground caves', 'Ice castles', 'Desert dunes'], correctAnswer: 'Gardens with Supertrees', funFact: 'The Supertrees are up to 50 meters tall and collect rainwater!' },
    { id: 'singapore-q4', questionText: 'What is banned in Singapore?', options: ['Chewing gum', 'Candy', 'Soda', 'Ice cream'], correctAnswer: 'Chewing gum', funFact: 'Gum was banned in 1992 to keep the city clean!' },
    { id: 'singapore-q5', questionText: 'How many languages are official in Singapore?', options: ['Four', 'Two', 'One', 'Three'], correctAnswer: 'Four', funFact: 'English, Mandarin, Malay, and Tamil are all official!' },
    { id: 'singapore-q6', questionText: 'What famous hotel has a rooftop infinity pool?', options: ['Marina Bay Sands', 'Hilton', 'Marriott', 'Hyatt'], correctAnswer: 'Marina Bay Sands', funFact: 'The pool is 150 meters long and 57 floors up!' },
    { id: 'singapore-q7', questionText: 'What is Singapore often called?', options: ['Lion City', 'Tiger City', 'Dragon City', 'Eagle City'], correctAnswer: 'Lion City', funFact: "Singapore comes from 'Singapura' meaning Lion City!" },
    { id: 'singapore-q8', questionText: 'What food court style is Singaporean?', options: ['Hawker centers', 'Food trucks', 'Diners', 'Cafeterias'], correctAnswer: 'Hawker centers', funFact: 'Singapore hawker culture is UNESCO protected!' },
    { id: 'singapore-q9', questionText: 'What noodle dish is Singaporean?', options: ['Laksa', 'Pho', 'Ramen', 'Pad Thai'], correctAnswer: 'Laksa', funFact: 'Laksa is a spicy coconut curry noodle soup!' },
    { id: 'singapore-q10', questionText: 'What is the size of Singapore?', options: ['Very small', 'Very large', 'Medium', 'Huge'], correctAnswer: 'Very small', funFact: 'Singapore is smaller than New York City!' },
    { id: 'singapore-q11', questionText: 'What crab dish is famous in Singapore?', options: ['Chili crab', 'Crab cakes', 'Crab soup', 'Crab salad'], correctAnswer: 'Chili crab', funFact: 'Chili crab was invented in Singapore in 1956!' },
    { id: 'singapore-q12', questionText: 'What zoo is famous in Singapore?', options: ['Night Safari', 'Day Zoo', 'Water Zoo', 'Bird Zoo'], correctAnswer: 'Night Safari', funFact: "It's the world's first nocturnal zoo!" },
    { id: 'singapore-q13', questionText: 'What wheel offers views of Singapore?', options: ['Singapore Flyer', 'London Eye', 'Big Wheel', 'Sky Wheel'], correctAnswer: 'Singapore Flyer', funFact: 'The Singapore Flyer is 165 meters tall!' },
    { id: 'singapore-q14', questionText: 'What ethnic neighborhood has colorful houses?', options: ['Little India', 'Chinatown', 'Arab Street', 'All of these'], correctAnswer: 'All of these', funFact: 'Singapore celebrates all its diverse cultures!' },
    { id: 'singapore-q15', questionText: 'What island resort is part of Singapore?', options: ['Sentosa', 'Bali', 'Phuket', 'Langkawi'], correctAnswer: 'Sentosa', funFact: "Sentosa means 'peace and tranquility' in Malay!" },
    { id: 'singapore-q16', questionText: 'What toast is a Singaporean breakfast?', options: ['Kaya toast', 'French toast', 'Avocado toast', 'Cheese toast'], correctAnswer: 'Kaya toast', funFact: 'Kaya is made from coconut, eggs, and pandan!' },
    { id: 'singapore-q17', questionText: 'What orchid is Singapores national flower?', options: ['Vanda Miss Joaquim', 'Rose', 'Lily', 'Tulip'], correctAnswer: 'Vanda Miss Joaquim', funFact: 'It was discovered in 1893 by Agnes Joaquim!' },
    { id: 'singapore-q18', questionText: 'What rice dish is Singaporean?', options: ['Hainanese chicken rice', 'Fried rice', 'Biryani', 'Paella'], correctAnswer: 'Hainanese chicken rice', funFact: 'Its considered Singapores national dish!' },
    { id: 'singapore-q19', questionText: 'What airport is ranked best in the world?', options: ['Changi Airport', 'Heathrow', 'JFK', 'Dubai'], correctAnswer: 'Changi Airport', funFact: 'Changi has a butterfly garden and movie theaters!' },
    { id: 'singapore-q20', questionText: 'What drink is popular in Singapore?', options: ['Singapore Sling', 'Mojito', 'Margarita', 'Pina Colada'], correctAnswer: 'Singapore Sling', funFact: 'The Singapore Sling was created in 1915!' },
  ],
  australia: [
    { id: 'australia-q1', questionText: 'What animal is famous in Australia?', options: ['Kangaroo', 'Elephant', 'Lion', 'Bear'], correctAnswer: 'Kangaroo', funFact: "Baby kangaroos are called joeys and live in their mom's pouch!" },
    { id: 'australia-q2', questionText: 'What famous building is in Sydney?', options: ['Opera House', 'Eiffel Tower', 'Big Ben', 'Colosseum'], correctAnswer: 'Opera House', funFact: 'The Sydney Opera House has over 1 million roof tiles!' },
    { id: 'australia-q3', questionText: 'What big red rock is in Australia?', options: ['Uluru', 'Grand Canyon', 'Stone Henge', "Giant's Causeway"], correctAnswer: 'Uluru', funFact: 'Uluru is sacred to Aboriginal Australians and changes color at sunset!' },
    { id: 'australia-q4', questionText: 'What is the capital of Australia?', options: ['Canberra', 'Sydney', 'Melbourne', 'Perth'], correctAnswer: 'Canberra', funFact: 'Canberra was purpose-built to be the capital!' },
    { id: 'australia-q5', questionText: 'What reef is off Australias coast?', options: ['Great Barrier Reef', 'Coral Reef', 'Blue Reef', 'Rainbow Reef'], correctAnswer: 'Great Barrier Reef', funFact: 'The Great Barrier Reef is visible from space!' },
    { id: 'australia-q6', questionText: 'What egg-laying mammal lives in Australia?', options: ['Platypus', 'Beaver', 'Otter', 'Seal'], correctAnswer: 'Platypus', funFact: 'The platypus has a bill like a duck and a tail like a beaver!' },
    { id: 'australia-q7', questionText: 'What bear-like animal eats eucalyptus?', options: ['Koala', 'Panda', 'Sloth', 'Raccoon'], correctAnswer: 'Koala', funFact: 'Koalas sleep up to 22 hours a day!' },
    { id: 'australia-q8', questionText: 'What dog is native to Australia?', options: ['Dingo', 'Wolf', 'Coyote', 'Fox'], correctAnswer: 'Dingo', funFact: 'Dingos came to Australia about 4,000 years ago!' },
    { id: 'australia-q9', questionText: 'What boomerang use is Australian?', options: ['Throwing and returning', 'Cooking', 'Building', 'Farming'], correctAnswer: 'Throwing and returning', funFact: 'Not all boomerangs come back - some were used for hunting!' },
    { id: 'australia-q10', questionText: 'What dangerous spider lives in Australia?', options: ['Funnel-web spider', 'Tarantula', 'Black widow', 'Brown recluse'], correctAnswer: 'Funnel-web spider', funFact: 'No one has died from a funnel-web bite since 1981 thanks to antivenom!' },
    { id: 'australia-q11', questionText: 'What sport did Australia invent?', options: ['Australian Rules Football', 'Rugby', 'Cricket', 'Tennis'], correctAnswer: 'Australian Rules Football', funFact: 'AFL uses an oval ball and an oval field!' },
    { id: 'australia-q12', questionText: 'What is the Australian outback?', options: ['Desert interior', 'Beach coast', 'Mountain range', 'Rainforest'], correctAnswer: 'Desert interior', funFact: 'The outback covers about 70% of Australia!' },
    { id: 'australia-q13', questionText: 'What spread do Australians love on toast?', options: ['Vegemite', 'Nutella', 'Peanut butter', 'Jam'], correctAnswer: 'Vegemite', funFact: 'Vegemite was invented in 1922 and is made from yeast!' },
    { id: 'australia-q14', questionText: 'What bridge is famous in Sydney?', options: ['Harbour Bridge', 'Golden Gate', 'Tower Bridge', 'Brooklyn Bridge'], correctAnswer: 'Harbour Bridge', funFact: 'You can climb to the top of the Sydney Harbour Bridge!' },
    { id: 'australia-q15', questionText: 'What are Australians often called?', options: ['Aussies', 'Ozzies', 'Downunders', 'Roos'], correctAnswer: 'Aussies', funFact: "Australia is often called 'the land down under'!" },
    { id: 'australia-q16', questionText: 'What flightless bird is Australian?', options: ['Emu', 'Ostrich', 'Penguin', 'Kiwi'], correctAnswer: 'Emu', funFact: 'Emus can run up to 50 km/h!' },
    { id: 'australia-q17', questionText: 'What is a famous Australian greeting?', options: ["G'day", 'Hello', 'Hi there', 'Howdy'], correctAnswer: "G'day", funFact: "G'day is short for 'Good day'!" },
    { id: 'australia-q18', questionText: 'What cake is Australian?', options: ['Lamington', 'Pavlova', 'Sponge cake', 'Fruitcake'], correctAnswer: 'Lamington', funFact: 'Lamingtons are sponge cake covered in chocolate and coconut!' },
    { id: 'australia-q19', questionText: 'What sea creature is dangerous in Australia?', options: ['Box jellyfish', 'Dolphin', 'Whale', 'Sea turtle'], correctAnswer: 'Box jellyfish', funFact: 'Box jellyfish are the most venomous marine animal!' },
    { id: 'australia-q20', questionText: 'What are Australian lifeguards famous for?', options: ['Surf rescue', 'Pool cleaning', 'Teaching swimming', 'Building sandcastles'], correctAnswer: 'Surf rescue', funFact: 'Australian lifeguards perform thousands of rescues each year!' },
  ],
  brazil: [
    { id: 'brazil-q1', questionText: 'What rainforest is in Brazil?', options: ['Amazon', 'Sahara', 'Congo', 'Taiga'], correctAnswer: 'Amazon', funFact: "The Amazon produces 20% of Earth's oxygen!" },
    { id: 'brazil-q2', questionText: 'What famous festival does Brazil have?', options: ['Rio Carnival', 'Oktoberfest', 'Diwali', 'Chinese New Year'], correctAnswer: 'Rio Carnival', funFact: 'Rio Carnival has over 2 million people on the streets each day!' },
    { id: 'brazil-q3', questionText: 'What sport is Brazil most famous for?', options: ['Soccer', 'Baseball', 'Cricket', 'Hockey'], correctAnswer: 'Soccer', funFact: 'Brazil has won the FIFA World Cup 5 times, more than any other country!' },
    { id: 'brazil-q4', questionText: 'What is the capital of Brazil?', options: ['Brasilia', 'Rio de Janeiro', 'Sao Paulo', 'Salvador'], correctAnswer: 'Brasilia', funFact: 'Brasilia was built in just 41 months in the 1960s!' },
    { id: 'brazil-q5', questionText: 'What famous statue overlooks Rio?', options: ['Christ the Redeemer', 'Statue of Liberty', 'David', 'Venus'], correctAnswer: 'Christ the Redeemer', funFact: 'Christ the Redeemer is 30 meters tall!' },
    { id: 'brazil-q6', questionText: 'What river flows through the Amazon?', options: ['Amazon River', 'Nile', 'Mississippi', 'Yangtze'], correctAnswer: 'Amazon River', funFact: 'The Amazon River is the largest river by water volume!' },
    { id: 'brazil-q7', questionText: 'What language do Brazilians speak?', options: ['Portuguese', 'Spanish', 'English', 'French'], correctAnswer: 'Portuguese', funFact: 'Brazil is the largest Portuguese-speaking country in the world!' },
    { id: 'brazil-q8', questionText: 'What martial art dance is Brazilian?', options: ['Capoeira', 'Kung Fu', 'Karate', 'Taekwondo'], correctAnswer: 'Capoeira', funFact: 'Capoeira was created by enslaved Africans in Brazil!' },
    { id: 'brazil-q9', questionText: 'What bird is colorful in Brazil?', options: ['Toucan', 'Penguin', 'Crow', 'Sparrow'], correctAnswer: 'Toucan', funFact: 'Toucans bills can be one-third of their body length!' },
    { id: 'brazil-q10', questionText: 'What BBQ style is Brazilian?', options: ['Churrasco', 'Bulgogi', 'Tandoori', 'Jerk'], correctAnswer: 'Churrasco', funFact: 'Churrasco is grilled on large skewers over an open flame!' },
    { id: 'brazil-q11', questionText: 'What waterfalls are on Brazils border?', options: ['Iguazu Falls', 'Niagara Falls', 'Victoria Falls', 'Angel Falls'], correctAnswer: 'Iguazu Falls', funFact: 'Iguazu Falls is made up of 275 individual waterfalls!' },
    { id: 'brazil-q12', questionText: 'What bean stew is Brazilian?', options: ['Feijoada', 'Chili', 'Minestrone', 'Goulash'], correctAnswer: 'Feijoada', funFact: 'Feijoada is considered Brazils national dish!' },
    { id: 'brazil-q13', questionText: 'What famous beach is in Rio?', options: ['Copacabana', 'Waikiki', 'Bondi', 'Miami Beach'], correctAnswer: 'Copacabana', funFact: 'Copacabana Beach is 4 km long!' },
    { id: 'brazil-q14', questionText: 'What animal is the largest rodent?', options: ['Capybara', 'Beaver', 'Porcupine', 'Guinea pig'], correctAnswer: 'Capybara', funFact: 'Capybaras can weigh up to 65 kg!' },
    { id: 'brazil-q15', questionText: 'What dance is Brazilian?', options: ['Samba', 'Tango', 'Salsa', 'Flamenco'], correctAnswer: 'Samba', funFact: 'Samba originated from African rhythms brought to Brazil!' },
    { id: 'brazil-q16', questionText: 'What fruit is Brazil named after?', options: ['Brazilwood tree', 'Brazil nut', 'Banana', 'Mango'], correctAnswer: 'Brazilwood tree', funFact: 'Brazilwood was used to make red dye!' },
    { id: 'brazil-q17', questionText: 'What pink dolphin lives in the Amazon?', options: ['Amazon river dolphin', 'Bottlenose', 'Orca', 'Beluga'], correctAnswer: 'Amazon river dolphin', funFact: 'Amazon river dolphins are also called boto!' },
    { id: 'brazil-q18', questionText: 'What coffee producer is Brazil?', options: ['Largest in world', 'Second largest', 'Third largest', 'Not a producer'], correctAnswer: 'Largest in world', funFact: 'Brazil produces about one-third of all coffee!' },
    { id: 'brazil-q19', questionText: 'What cheese bread is Brazilian?', options: ['Pao de queijo', 'Croissant', 'Bagel', 'Pretzel'], correctAnswer: 'Pao de queijo', funFact: "Pao de queijo means 'cheese bread' in Portuguese!" },
    { id: 'brazil-q20', questionText: 'What famous soccer player is Brazilian?', options: ['Pele', 'Messi', 'Ronaldo CR7', 'Maradona'], correctAnswer: 'Pele', funFact: 'Pele scored over 1,000 career goals!' },
  ],
  canada: [
    { id: 'canada-q1', questionText: "What leaf is on Canada's flag?", options: ['Maple leaf', 'Oak leaf', 'Palm leaf', 'Fern leaf'], correctAnswer: 'Maple leaf', funFact: "Maple syrup comes from maple trees - Canada makes 71% of the world's supply!" },
    { id: 'canada-q2', questionText: 'What famous waterfall is between Canada and USA?', options: ['Niagara Falls', 'Victoria Falls', 'Angel Falls', 'Iguazu Falls'], correctAnswer: 'Niagara Falls', funFact: 'Niagara Falls is actually three waterfalls combined!' },
    { id: 'canada-q3', questionText: "What animal is Canada's national symbol?", options: ['Beaver', 'Moose', 'Bear', 'Goose'], correctAnswer: 'Beaver', funFact: 'Beavers build dams that can be seen from space!' },
    { id: 'canada-q4', questionText: 'What is the capital of Canada?', options: ['Ottawa', 'Toronto', 'Vancouver', 'Montreal'], correctAnswer: 'Ottawa', funFact: 'Ottawa has the worlds longest skating rink on the Rideau Canal!' },
    { id: 'canada-q5', questionText: 'What sport did Canada invent?', options: ['Ice hockey', 'Baseball', 'Basketball', 'Football'], correctAnswer: 'Ice hockey', funFact: 'The first organized indoor hockey game was in Montreal in 1875!' },
    { id: 'canada-q6', questionText: 'What are Canadian police called?', options: ['Mounties', 'Bobbies', 'Sheriffs', 'Rangers'], correctAnswer: 'Mounties', funFact: 'Mounties famously ride horses and wear red uniforms!' },
    { id: 'canada-q7', questionText: 'What two languages are official in Canada?', options: ['English and French', 'English and Spanish', 'English only', 'French only'], correctAnswer: 'English and French', funFact: 'Quebec is the main French-speaking province!' },
    { id: 'canada-q8', questionText: 'What tower is in Toronto?', options: ['CN Tower', 'Eiffel Tower', 'Space Needle', 'Tokyo Tower'], correctAnswer: 'CN Tower', funFact: 'The CN Tower was the worlds tallest structure for 32 years!' },
    { id: 'canada-q9', questionText: 'What dish is Canadian with gravy and cheese?', options: ['Poutine', 'Fish and chips', 'Nachos', 'Chili fries'], correctAnswer: 'Poutine', funFact: 'Poutine has fries, cheese curds, and gravy!' },
    { id: 'canada-q10', questionText: 'What ocean is on Canadas west coast?', options: ['Pacific', 'Atlantic', 'Arctic', 'Indian'], correctAnswer: 'Pacific', funFact: 'Vancouver is Canadas main Pacific coast city!' },
    { id: 'canada-q11', questionText: 'What bear lives in northern Canada?', options: ['Polar bear', 'Grizzly bear', 'Black bear', 'Panda'], correctAnswer: 'Polar bear', funFact: 'Churchill, Manitoba is called the polar bear capital of the world!' },
    { id: 'canada-q12', questionText: 'What mountain range is in western Canada?', options: ['Rocky Mountains', 'Alps', 'Himalayas', 'Andes'], correctAnswer: 'Rocky Mountains', funFact: 'The Canadian Rockies have beautiful turquoise lakes!' },
    { id: 'canada-q13', questionText: 'What is Canada the second largest country in?', options: ['Land area', 'Population', 'Economy', 'Military'], correctAnswer: 'Land area', funFact: 'Canada has more lakes than all other countries combined!' },
    { id: 'canada-q14', questionText: 'What pastry is Canadian?', options: ['Butter tart', 'Croissant', 'Danish', 'Strudel'], correctAnswer: 'Butter tart', funFact: 'Butter tarts have a gooey filling of butter, sugar, and eggs!' },
    { id: 'canada-q15', questionText: 'What Northern Lights can you see in Canada?', options: ['Aurora Borealis', 'Aurora Australis', 'Northern Star', 'Milky Way'], correctAnswer: 'Aurora Borealis', funFact: 'Yellowknife is one of the best places to see the Northern Lights!' },
    { id: 'canada-q16', questionText: 'What donut chain is Canadian?', options: ['Tim Hortons', 'Dunkin', 'Krispy Kreme', 'Starbucks'], correctAnswer: 'Tim Hortons', funFact: 'Tim Hortons was founded by a hockey player in 1964!' },
    { id: 'canada-q17', questionText: 'What big cat lives in Canada?', options: ['Cougar', 'Lion', 'Tiger', 'Leopard'], correctAnswer: 'Cougar', funFact: 'Cougars are also called mountain lions or pumas!' },
    { id: 'canada-q18', questionText: 'What island is Canadas largest?', options: ['Baffin Island', 'Vancouver Island', 'Prince Edward', 'Newfoundland'], correctAnswer: 'Baffin Island', funFact: 'Baffin Island is the fifth largest island in the world!' },
    { id: 'canada-q19', questionText: 'What Canadian invented the telephone?', options: ['Alexander Graham Bell', 'Thomas Edison', 'Nikola Tesla', 'Marconi'], correctAnswer: 'Alexander Graham Bell', funFact: 'Bell made the first telephone call in 1876!' },
    { id: 'canada-q20', questionText: 'What bacon is Canadian?', options: ['Back bacon', 'Streaky bacon', 'Turkey bacon', 'Beef bacon'], correctAnswer: 'Back bacon', funFact: 'Canadian bacon is leaner than regular bacon!' },
  ],
  usa: [
    { id: 'usa-q1', questionText: 'What statue welcomes visitors to New York?', options: ['Statue of Liberty', 'Statue of David', 'Christ the Redeemer', 'Venus de Milo'], correctAnswer: 'Statue of Liberty', funFact: 'The Statue of Liberty was a gift from France in 1886!' },
    { id: 'usa-q2', questionText: "What mountain has presidents' faces carved on it?", options: ['Mount Rushmore', 'Mount Everest', 'Mount Fuji', 'Mount McKinley'], correctAnswer: 'Mount Rushmore', funFact: "It took 14 years to carve the four presidents' faces!" },
    { id: 'usa-q3', questionText: 'What snack is popular at American movies?', options: ['Popcorn', 'Sushi', 'Pizza', 'Tacos'], correctAnswer: 'Popcorn', funFact: 'Americans eat about 17 billion quarts of popcorn per year!' },
    { id: 'usa-q4', questionText: 'What is the capital of the USA?', options: ['Washington D.C.', 'New York', 'Los Angeles', 'Chicago'], correctAnswer: 'Washington D.C.', funFact: 'Washington D.C. is not in any state!' },
    { id: 'usa-q5', questionText: 'How many states are in the USA?', options: ['50', '48', '52', '46'], correctAnswer: '50', funFact: 'Hawaii and Alaska were the last two states added in 1959!' },
    { id: 'usa-q6', questionText: 'What canyon is famous in Arizona?', options: ['Grand Canyon', 'Bryce Canyon', 'Zion Canyon', 'Antelope Canyon'], correctAnswer: 'Grand Canyon', funFact: 'The Grand Canyon is over a mile deep!' },
    { id: 'usa-q7', questionText: 'What bridge is famous in San Francisco?', options: ['Golden Gate Bridge', 'Brooklyn Bridge', 'London Bridge', 'Tower Bridge'], correctAnswer: 'Golden Gate Bridge', funFact: 'The Golden Gate Bridge is actually painted orange, not gold!' },
    { id: 'usa-q8', questionText: 'What bird is the national symbol of USA?', options: ['Bald Eagle', 'Turkey', 'Hawk', 'Owl'], correctAnswer: 'Bald Eagle', funFact: 'Bald eagles can see fish from a mile away!' },
    { id: 'usa-q9', questionText: 'What theme park is in Florida?', options: ['Disney World', 'Disneyland', 'Universal only', 'SeaWorld only'], correctAnswer: 'Disney World', funFact: 'Disney World is twice the size of Manhattan!' },
    { id: 'usa-q10', questionText: 'What holiday celebrates American independence?', options: ['July 4th', 'Thanksgiving', 'Memorial Day', 'Labor Day'], correctAnswer: 'July 4th', funFact: 'July 4th celebrates independence from Britain in 1776!' },
    { id: 'usa-q11', questionText: 'What is Americas most popular sport?', options: ['American Football', 'Baseball', 'Basketball', 'Soccer'], correctAnswer: 'American Football', funFact: 'The Super Bowl is watched by over 100 million Americans!' },
    { id: 'usa-q12', questionText: 'What city is called the Big Apple?', options: ['New York', 'Los Angeles', 'Chicago', 'Miami'], correctAnswer: 'New York', funFact: 'The nickname Big Apple was popularized in the 1920s!' },
    { id: 'usa-q13', questionText: 'What building is white and where the President lives?', options: ['White House', 'Capitol', 'Pentagon', 'Empire State'], correctAnswer: 'White House', funFact: 'The White House has 132 rooms!' },
    { id: 'usa-q14', questionText: 'What food is American BBQ famous for?', options: ['Ribs', 'Sushi', 'Tacos', 'Curry'], correctAnswer: 'Ribs', funFact: 'American BBQ styles vary by region - Texas, Carolina, Kansas City!' },
    { id: 'usa-q15', questionText: 'What music originated in New Orleans?', options: ['Jazz', 'Classical', 'Opera', 'Folk'], correctAnswer: 'Jazz', funFact: 'Jazz developed in the early 20th century in New Orleans!' },
    { id: 'usa-q16', questionText: 'What Hollywood sign is on a hill?', options: ['Hollywood Sign', 'Walk of Fame', 'Sunset Sign', 'LA Sign'], correctAnswer: 'Hollywood Sign', funFact: 'The Hollywood Sign was originally an ad for real estate!' },
    { id: 'usa-q17', questionText: 'What pie is traditionally American?', options: ['Apple pie', 'Meat pie', 'Pumpkin only', 'Cherry only'], correctAnswer: 'Apple pie', funFact: 'The phrase is as American as apple pie!' },
    { id: 'usa-q18', questionText: 'What skyscraper was once the tallest?', options: ['Empire State Building', 'Chrysler Building', 'Sears Tower', 'Freedom Tower'], correctAnswer: 'Empire State Building', funFact: 'The Empire State Building has 102 floors!' },
    { id: 'usa-q19', questionText: 'What national park has geysers?', options: ['Yellowstone', 'Yosemite', 'Grand Canyon', 'Zion'], correctAnswer: 'Yellowstone', funFact: 'Old Faithful geyser erupts about every 90 minutes!' },
    { id: 'usa-q20', questionText: 'What fast food is American?', options: ['Hamburgers', 'Sushi', 'Tacos', 'Kebabs'], correctAnswer: 'Hamburgers', funFact: 'Americans eat about 50 billion burgers per year!' },
  ],
};

/**
 * Shuffles an array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Get a quiz by its country ID with 3 randomly selected questions
 * @param countryId - The country ID to search for
 * @returns The quiz with 3 random questions if found, undefined otherwise
 */
export function getQuizByCountryId(countryId: string): CountryQuiz | undefined {
  const questions = questionBanks[countryId];
  if (!questions) return undefined;

  // Randomly select 3 questions from the bank
  const shuffledQuestions = shuffleArray(questions);
  const selectedQuestions = shuffledQuestions.slice(0, 3);

  // Get country name from countryId (capitalize first letter)
  const countryName = countryId.charAt(0).toUpperCase() + countryId.slice(1);

  return {
    id: `quiz-${countryId}`,
    countryId,
    name: countryName,
    questions: selectedQuestions,
  };
}

/**
 * Get all question banks (for testing purposes)
 */
export function getQuestionBanks(): Record<string, QuizQuestion[]> {
  return questionBanks;
}

/**
 * Legacy export for backwards compatibility with tests
 * Returns quizzes with all questions (not randomized)
 */
export const quizzes: CountryQuiz[] = Object.entries(questionBanks).map(([countryId, questions]) => ({
  id: `quiz-${countryId}`,
  countryId,
  name: countryId.charAt(0).toUpperCase() + countryId.slice(1),
  questions: questions.slice(0, 3), // Return first 3 for consistency in tests
}));
