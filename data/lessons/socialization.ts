/**
 * Socialization Category
 * 11 lessons: 1 free intro, 10 premium
 * PLACEMENT: data/lessons/socialization.ts
 */

import { Lesson } from '../categoryData';

export const SOCIALIZATION_LESSONS: Lesson[] = [
  // ── FREE INTRO ──
  {
    id: 'soc_1',
    title: 'What Socialization Actually Means',
    description: 'Most people get this wrong. Learn what real socialization looks like before you start.',
    duration: 8,
    difficulty: 1,
    isPremium: false,
    steps: [
      'Socialization is NOT "let your dog meet as many dogs as possible." That approach causes more problems than it solves. Real socialization is about teaching your dog that the world is safe, predictable, and not something to worry about.',
      'The goal is neutral exposure, not forced interaction. You want your dog to notice new things and think "that exists, no big deal" rather than "I MUST go investigate" or "that is terrifying." Calm observation is the win here.',
      'There are four categories of socialization: people (different ages, sizes, appearances, clothing), environments (surfaces, sounds, locations), other animals (dogs, cats, birds, livestock), and handling (being touched, held, examined by strangers).',
      'The critical socialization window for puppies closes around 14-16 weeks. During this period, their brain is literally wired to file new experiences as "normal." After the window closes, new things default to "suspicious" instead. This is biology, not behavior.',
      'If your dog is past the socialization window, don\'t panic. Adult dogs can still learn to be comfortable with new things. It just takes more patience, more repetitions, and more careful management of their exposure distance and duration.',
      'The golden rule of socialization: your dog should always have an escape route. Never force them toward something they\'re uncomfortable with. Let them approach on their own terms, at their own pace. Forcing creates fear. Choice builds confidence.'
    ],
    tips: [
      'Watch your dog, not the distraction. Their body language tells you everything. Soft body, loose tail, curious sniffing means they\'re comfortable. Hard stare, stiff body, lip licking, or trying to move away means too much too fast.',
      'Carry high-value treats everywhere during socialization work. Every calm, neutral response to something new gets a reward. You\'re building the association: new stuff equals good stuff.',
      'One bad experience can undo ten good ones, especially during the puppy window. If your dog gets spooked, scared, or overwhelmed, you\'ve pushed too far. Back up, make it easier next time, and don\'t repeat the mistake.',
      'Socialization is not a one-time event. It\'s ongoing maintenance for your dog\'s entire life. A dog who was well-socialized as a puppy but then spent two years in a backyard can still become fearful.'
    ]
  },

  // ── PREMIUM LESSONS ──
  {
    id: 'soc_2',
    title: 'People Exposure Protocol',
    description: 'How to safely introduce your dog to all types of people without creating fear.',
    duration: 12,
    difficulty: 2,
    isPremium: true,
    steps: [
      'Make a checklist of human variations your dog needs to experience: tall people, short people, children, elderly, people with beards, hats, sunglasses, uniforms, wheelchairs, canes, backpacks, and different skin tones. Dogs notice all of these differences.',
      'Start with calm, dog-savvy adults who will follow your instructions. Have them stand at a distance where your dog notices them but isn\'t stressed. Reward your dog for calm observation. Gradually decrease distance over multiple sessions.',
      'The stranger should NEVER reach toward your dog first. Let your dog approach them. The stranger stays neutral, avoids direct eye contact, and turns slightly sideways. If the dog sniffs and moves away, that\'s perfectly fine. Don\'t lure them back.',
      'For children specifically: supervise every single interaction. Kids are unpredictable, loud, and move in ways that can trigger prey drive or fear. Start with calm older children before introducing toddlers. Never leave any dog unsupervised with a child.',
      'For people in uniforms, hats, or unusual appearances: create the association at distance first. Have a friend put on a hat 20 feet away while you feed your dog treats. Then 15 feet. Then 10. Don\'t rush it.',
      'Practice "look at that" exercises. When your dog notices a new person, say "yes!" and treat. You\'re rewarding the act of noticing without reacting. Over time, your dog will see a new person and look at YOU for a treat instead of stressing about the stranger.'
    ],
    tips: [
      'Ask strangers to toss treats on the ground instead of hand-feeding. This keeps the dog below threshold and prevents them from associating hands reaching toward them with food (which can cause mugging or nipping later).',
      'If your dog barks at someone, don\'t apologize and force them closer. Create distance, let your dog decompress, and try again at a further distance next time. The bark is information, not disobedience.',
      'For herding breeds and Aussies: stranger wariness is often breed-typical. They were bred to be suspicious of unfamiliar things on the farm. Expect this to take longer and be patient with the process.',
      'Log your exposures. Literally write down who your dog met, their reaction, and what worked. This helps you identify patterns and gaps in their experience.'
    ]
  },
  {
    id: 'soc_3',
    title: 'Dog-to-Dog Introductions',
    description: 'The right way to introduce dogs without fights, fear, or bad habits.',
    duration: 15,
    difficulty: 3,
    isPremium: true,
    steps: [
      'Never introduce dogs face-to-face on tight leashes. This is the single most common mistake and it causes the majority of leash greeting problems. Tight leash plus face-to-face approach equals maximum tension for both dogs.',
      'The parallel walk method: both dogs walk in the same direction, about 15-20 feet apart, with a handler each. They can see and smell each other without direct interaction. Walk for 5-10 minutes. If both dogs are relaxed, gradually decrease the distance.',
      'When distance is down to about 6 feet and both dogs are relaxed, do a "curved approach." Let one dog arc toward the other in a curve, not a straight line. Straight approaches are confrontational in dog body language. Curves signal friendly intent.',
      'Allow sniffing for about 3 seconds, then cheerfully call your dog away and reward. Short, controlled greetings are better than letting them figure it out. Interrupt before things escalate, not after.',
      'If either dog shows stiffness, hard staring, raised hackles, or closed mouth tension, calmly increase distance. Don\'t yank the leash or panic. Just walk away casually and try again later or another day.',
      'For off-leash introductions in a controlled space: let one dog explore the space first for 5 minutes. Then bring the second dog in on leash. Drop the leash (don\'t remove it, just drop it so you can grab it if needed). Let them interact naturally while you stay calm and quiet.'
    ],
    tips: [
      'Dog parks are NOT socialization. They are uncontrolled environments full of dogs with unknown histories, bad habits, and absent owners. For genuine socialization, use controlled setups with known, stable dogs.',
      'Puppies should only meet vaccinated, temperamentally stable adult dogs who are known to be good with puppies. One bad experience with an aggressive adult dog can create lifelong dog reactivity.',
      'Match energy levels. Don\'t introduce your calm senior dog to a hyperactive adolescent. Don\'t put your nervous small dog with a rowdy lab. Mismatched energy creates conflict.',
      'Sniffing butts is polite in dog language. Sniffing faces is rude. If your dog consistently goes straight for the face, that\'s a social skills gap that needs work.'
    ]
  },
  {
    id: 'soc_4',
    title: 'Sound Desensitization',
    description: 'Build your dog\'s confidence with loud, sudden, and unfamiliar noises.',
    duration: 10,
    difficulty: 2,
    isPremium: true,
    steps: [
      'Find a sound desensitization playlist on YouTube or Spotify. These include thunder, fireworks, sirens, construction, babies crying, doorbells, vacuum cleaners, and more. You\'ll use this as your training tool.',
      'Start with the volume at barely audible. Like, you can hardly hear it yourself. Play it during normal activities: mealtime, play, chill time. Your dog might not even notice at this volume. That\'s the point.',
      'Over several days, increase the volume by the smallest increment possible. Watch your dog. If they look toward the sound but go back to what they were doing, you\'re at the right level. If they freeze, pant, pace, or try to leave, you went too fast. Turn it back down.',
      'Pair scary sounds with amazing things. Thunder sound plays quietly and a piece of chicken appears. Firework boom and a treat lands between their paws. You\'re building the association: loud noise equals something delicious.',
      'Practice with real household sounds too. Run the blender, vacuum, washing machine. Start from far away, reward calm behavior, and gradually get closer over time. Don\'t just turn on the vacuum next to a sleeping dog and hope for the best.',
      'For dogs already scared of specific sounds: don\'t wait for the real thing to practice. Record the trigger sound on your phone and use the gradual exposure protocol. Real thunderstorms and fireworks are too intense and unpredictable for training.'
    ],
    tips: [
      'Never comfort a scared dog with baby talk or coddling. This reinforces the fear. Instead, act completely normal and unbothered. Your calm energy teaches them there\'s nothing to worry about.',
      'Some dogs do better with a "safe space" during loud events. A covered crate, a closet, or a bathroom can help. Let them choose to go there. Don\'t lock them in.',
      'For firework and thunder phobias that are severe, talk to your vet about medication. Desensitization training works, but if your dog is in full panic mode, they can\'t learn anything. Medication reduces the panic enough for the training to take hold.',
      'Puppies in the socialization window (under 16 weeks) can learn to be completely fine with sounds in just a few days of exposure. Adult dogs with established fears may take weeks or months. Both timelines are normal.'
    ]
  },
  {
    id: 'soc_5',
    title: 'Surface and Texture Confidence',
    description: 'Teach your dog to walk confidently on any surface they encounter.',
    duration: 8,
    difficulty: 1,
    isPremium: true,
    steps: [
      'Gather different surfaces for your dog to experience: metal grates, wooden boards, bubble wrap, a tarp, a cookie sheet, carpet squares, wet grass, gravel, sand. Set them up inside your home or yard where your dog feels safe.',
      'Don\'t force your dog onto any surface. Place treats on the edge of the new surface and let them investigate. If they step on it, reward generously. If they only sniff it, that\'s okay too. Progress happens at their pace.',
      'Start with low-challenge surfaces (a towel on the floor, a yoga mat) before moving to things that move, make noise, or feel strange underfoot. Build confidence gradually.',
      'Once your dog is comfortable stepping on surfaces at home, take it on the road. Walk over grates on the sidewalk, across wooden bridges, over storm drains. Carry treats and reward every confident step.',
      'Pay attention to which surfaces your dog avoids in real life. If they always walk around manhole covers or refuse to step on wet pavement, that tells you exactly what to practice.',
      'Make it a game. Scatter treats across a tarp or hide them under a flipped-over kiddie pool. Turn the scary thing into a treasure hunt.'
    ],
    tips: [
      'Slippery floors (tile, hardwood) are one of the most common surface fears, especially in puppies. Put down rugs or yoga mats at first, then gradually remove them as confidence builds.',
      'If your dog refuses a surface, check if it\'s painful, not just scary. Hot pavement, sharp gravel, or icy metal can actually hurt their paws. Use the back-of-hand test: if it\'s too hot for your hand, it\'s too hot for their feet.',
      'For Aussies and herding breeds: they tend to be naturally cautious about new surfaces. It\'s a working trait. They\'ll get there, but expect them to need more repetitions than a bold retriever type.',
      'Nail length matters. Long nails on slick surfaces make dogs feel unstable, which creates negative associations. Keep nails trimmed.'
    ]
  },
  {
    id: 'soc_6',
    title: 'Environment Exposure',
    description: 'How to introduce your dog to new places without overwhelming them.',
    duration: 12,
    difficulty: 2,
    isPremium: true,
    steps: [
      'Make a list of environments your dog will encounter in real life: pet stores, vet offices, outdoor cafes, parking lots, parks, hardware stores (many allow dogs), farmers markets, friend\'s houses, elevators, stairwells, the car.',
      'For each new environment, start with the least intense version. Don\'t take your dog into a packed Saturday farmers market as their first outing. Go on a Tuesday morning when it\'s dead. Build up to the chaos.',
      'Arrive early and stay on the perimeter. Let your dog observe from a distance where they\'re comfortable. Feed treats steadily for calm behavior. You\'re creating the foundation of "new places equal good things."',
      'Watch for signs of stress: excessive panting, drooling, tucked tail, refusing treats (a huge red flag that means they\'re over threshold), whale eye, or trying to bolt. If you see any of these, you\'re too close or it\'s too much. Leave and try a quieter version next time.',
      'Spend 10-15 minutes per outing maximum for new dogs. Short positive trips beat long exhausting ones. End every outing on a good note while your dog is still comfortable.',
      'Repeat the same environment multiple times before adding a new one. Your dog needs to feel "I know this place" before you add another unknown. Three successful visits to the pet store before trying the outdoor cafe.'
    ],
    tips: [
      'Carry a "settling mat" or small towel that becomes your dog\'s portable safe zone. Practice mat training at home first (see Calm & Focus category), then bring it everywhere. When you put the mat down, your dog knows what to do.',
      'Don\'t just go to dog-centric places. Your dog needs to be comfortable in human environments too. Hardware stores, bank drive-throughs (from the car), coffee shop patios. The more variety, the more adaptable your dog becomes.',
      'Vet offices are one of the most important places to make positive. Stop by just to let your dog get treats at the front desk without any actual appointment. Do this 3-4 times before their first real visit.',
      'For puppies not fully vaccinated: carry them into stores and public spaces. They can observe and smell everything without touching contaminated ground. A puppy in your arms at a pet store is still getting socialized.'
    ]
  },
  {
    id: 'soc_7',
    title: 'Handling by Strangers',
    description: 'Prepare your dog to be touched, examined, and handled by people they don\'t know.',
    duration: 10,
    difficulty: 2,
    isPremium: true,
    steps: [
      'Your dog will be handled by strangers throughout their life: vets, groomers, pet sitters, well-meaning people on the street. Teaching them that handling is safe (and even enjoyable) prevents fear, biting, and dangerous situations.',
      'Start with yourself. Practice touching every part of your dog while pairing each touch with a treat. Touch ear, treat. Lift paw, treat. Look in mouth, treat. Handle tail, treat. Open eye, treat. Do this daily until your dog relaxes into it.',
      'Once your dog is comfortable with your handling, recruit a friend. Have the friend approach slowly, offer the back of their hand for sniffing, then do one gentle touch (shoulder, not head). Treat from your hand. Build from there.',
      'Practice the vet exam simulation: have someone lift lips to look at teeth, look in ears, press gently on belly, lift each paw and hold it. Treat generously throughout. The goal is a dog who stands calmly through the whole process.',
      'For the groomer simulation: run a brush along their body, hold a (silent) clipper near their paws, touch around their feet and between their toes, lift their tail. Many grooming fears come from the dog never experiencing these sensations before the first appointment.',
      'Teach a chin rest on your hand. This gives your dog an active role in the handling process. If they keep their chin on your hand, they\'re consenting. If they pull away, you pause. This builds trust and reduces stress dramatically.'
    ],
    tips: [
      'Don\'t let strangers pet your dog on the head. Most dogs don\'t like it. Suggest they scratch the chest or shoulder instead. Head pats from above trigger a lot of dogs\' defensive instincts.',
      'It\'s okay to tell people "sorry, my dog is in training" when they want to pet without asking. You\'re your dog\'s advocate. Their comfort matters more than a stranger\'s feelings.',
      'For dogs who are already hand-shy or fear-aggressive around handling: go extremely slowly and consider working with a professional. Forcing handling on a scared dog escalates the fear.',
      'Puppies should be handled by 100 different people in their first 3 months at home. That sounds like a lot, but it includes family, friends, neighbors, vet staff, and anyone willing to give your puppy a treat.'
    ]
  },
  {
    id: 'soc_8',
    title: 'Puppy Socialization Blueprint',
    description: 'A week-by-week plan for your puppy\'s critical socialization window.',
    duration: 15,
    difficulty: 2,
    isPremium: true,
    steps: [
      'Week 1 (8-9 weeks): Focus on household sounds, surfaces, and handling. Run the dishwasher, vacuum from far away, play music. Walk on tile, carpet, grass. Practice being held, having paws touched, wearing a collar. Everything is new, so keep it gentle.',
      'Week 2 (9-10 weeks): Add car rides (short, positive). Visit a friend\'s house with a vaccinated dog. Carry your puppy into a pet store. Introduce 3-5 new people following the handling protocol. Keep all interactions brief and positive.',
      'Week 3 (10-11 weeks): Outdoor exposure begins. Sit on a bench near a walking path and let your puppy observe. Visit the vet for a "happy visit" (treats, no exam). Practice walking on new surfaces (wood, metal, rubber). Begin sound desensitization playlist.',
      'Week 4 (11-12 weeks): Puppy socialization class if available (verify health requirements). More dog-to-dog introductions with known, stable dogs. Outdoor cafe visit. Different neighborhoods and environments. Start handling by a second person.',
      'Week 5-6 (12-14 weeks): Increase intensity slightly. Busier environments (with escape route always available). More varied people (children, elderly, uniforms). Groomer visit for a quick intro. Continue building on everything from previous weeks.',
      'After 14 weeks: The window is closing but socialization continues. Maintain what you\'ve built by continuing regular exposure. Add new experiences at the dog\'s pace. The foundation from these early weeks will serve them for their entire life.'
    ],
    tips: [
      'Quality over quantity, always. Ten calm positive experiences beat fifty overwhelming ones. If your puppy shows any stress, scale it back.',
      'Take photos and videos of each socialization outing. You\'ll be able to look back and see their confidence grow. It also helps you track what you\'ve covered and what\'s missing.',
      'Enroll in a puppy class with strict health requirements (first vaccine series, deworming). The structured environment is safer than random dog park encounters.',
      'Sleep is critical for puppies processing new experiences. After a socialization outing, let your puppy nap. Their brain is literally building new neural pathways during rest.'
    ]
  },
  {
    id: 'soc_9',
    title: 'Adolescent Socialization Recovery',
    description: 'Missed the puppy window? How to socialize an adolescent or adult dog.',
    duration: 12,
    difficulty: 3,
    isPremium: true,
    steps: [
      'First, accept where you are. Many rescue dogs, pandemic puppies, and dogs from rural backgrounds missed their socialization window. This doesn\'t mean they\'re broken. It means the work takes longer and requires more patience.',
      'Start with a behavior baseline. Take your dog to three different environments (a quiet park, a pet store, a neighborhood street) and write down everything they react to. This gives you your training roadmap.',
      'Use the "look at that" (LAT) game as your foundation tool. When your dog notices a trigger at distance, mark ("yes!") and treat. You\'re rewarding the act of noticing without reacting. This is the backbone of all adult socialization work.',
      'Create a desensitization hierarchy for each trigger. Example for dog reactivity: (1) sees a dog at 50 feet, (2) sees a dog at 30 feet, (3) sees a dog at 15 feet, (4) walks parallel to a dog at 20 feet, (5) walks past a dog at 10 feet. Work each level until it\'s boring before moving to the next.',
      'Set up controlled exposures. Don\'t rely on random encounters. Recruit friends with calm dogs, visit locations at specific times you know the intensity level, and always have an escape plan.',
      'Expect regression. Your dog will have great days and terrible days. A dog who walked calmly past three people yesterday might bark at everyone today. This is normal. Zoom out and look at the trend over weeks, not individual sessions.'
    ],
    tips: [
      'Muzzle training is not a punishment. For dogs with bite risk during socialization work, a properly fitted basket muzzle keeps everyone safe and lets you train in real environments without constant anxiety.',
      'Consider working with a certified professional (CPDT-KA, CAAB, or veterinary behaviorist) for dogs with serious socialization gaps. Some cases benefit from medication to lower baseline anxiety enough for the training to work.',
      'Celebrate small wins. Your dog looked at a stranger and didn\'t bark? That\'s a victory. They walked past a dog at 20 feet without lunging? Huge progress. The milestones are smaller but they still matter.',
      'For rescue dogs: give them at least 2 weeks to decompress in your home before starting any socialization work. The "3-3-3 rule" (3 days to decompress, 3 weeks to learn your routine, 3 months to feel at home) exists for a reason.'
    ]
  },
  {
    id: 'soc_10',
    title: 'Children and Baby Preparation',
    description: 'How to prepare your dog for life with young children.',
    duration: 12,
    difficulty: 3,
    isPremium: true,
    steps: [
      'Children move erratically, scream suddenly, grab without warning, and stare directly at dogs. From a dog\'s perspective, small children are unpredictable and potentially threatening. This is not about your dog being "bad." It\'s about preparing them for a genuinely challenging situation.',
      'Start with recorded sounds of babies crying, children screaming, and kids playing. Use the sound desensitization protocol: start quiet, pair with treats, gradually increase volume over days. Don\'t skip this step.',
      'Practice having your dog maintain a "place" command while you simulate child-like chaos. Wave your arms, move erratically, drop things, make sudden noises. Reward staying on place through each new distraction.',
      'Teach your dog that a baby gate is their friend, not a punishment. Set up gates before a baby arrives. Feed meals behind the gate. Give the best chews and toys there. The gated area should feel like VIP access, not exile.',
      'Practice handling your dog the way a toddler would (gently): touch ears, grab tail briefly, touch paws, pat the head heavily. Pair each with treats. If your dog shows ANY discomfort (lip lick, whale eye, moving away), stop and work at a lower intensity.',
      'Once a baby or child is in the home: never, ever leave them unsupervised together. Not for one second. Not even with the "gentlest dog in the world." Management (gates, crates, separate spaces) prevents incidents. Training alone is not enough.'
    ],
    tips: [
      'The most dangerous moment is not when a dog meets a baby for the first time. It\'s 18 months later when the toddler starts crawling and grabbing. That\'s when most dog-bite-to-child incidents happen. Prepare now for that stage.',
      'Teach children (when old enough) the rules: don\'t approach a dog when they\'re sleeping, eating, or chewing. Don\'t hug dogs around the neck. Don\'t stare. Don\'t scream in their face. Don\'t chase them.',
      'Give your dog a safe retreat space that children cannot access. Every dog needs a place where they can go and not be followed. This reduces their stress enormously.',
      'If you\'re expecting a baby: bring home a blanket with the baby\'s scent before the baby arrives. Let the dog sniff it calmly. Don\'t make a big production out of it. Just let it exist in the house.'
    ]
  },
  {
    id: 'soc_11',
    title: 'Group Class Preparation',
    description: 'Set your dog up for success before their first training class.',
    duration: 10,
    difficulty: 2,
    isPremium: true,
    steps: [
      'Most people show up to group class and their dog loses their mind because it\'s too much new stuff at once: new building, new people, new dogs, and someone asking them to perform behaviors. You can prevent this by front-loading the exposure.',
      'Visit the training facility without your dog first. Learn the layout, meet the trainer, understand the parking situation. This reduces YOUR stress on class day, which your dog will pick up on.',
      'Drive to the facility with your dog 2-3 times before class starts. Sit in the parking lot, feed treats, and leave. Your dog learns the car ride to this building predicts good things.',
      'Practice basic focus exercises (name recognition, watch me, sit) in new environments before class. The pet store, a friend\'s house, the park. Your dog needs to know these skills work outside your living room.',
      'On class day: arrive early. Let your dog sniff the area outside first. Enter the building and find your spot before it gets crowded. Have high-value treats ready. Expect your dog to be distracted and don\'t punish it.',
      'During class: if your dog is overwhelmed, it\'s okay to increase distance. Move to the back of the room or step outside for a breather. A good trainer will support this. A trainer who tells you to force your dog to stay and deal with it is not someone you want teaching you.'
    ],
    tips: [
      'Skip the retractable leash. Bring a standard 6-foot leash to class. You need control and consistency in close quarters.',
      'Don\'t feed a big meal before class. A slightly hungry dog is more motivated by treats and more likely to engage with training.',
      'If your dog is reactive to other dogs, email the trainer beforehand. Ask if they accommodate reactive dogs or if they can suggest a more appropriate class format.',
      'After class, let your dog decompress. Don\'t go run errands or visit another new place. Go home, let them nap, and let their brain process what they just experienced.'
    ]
  },
];
