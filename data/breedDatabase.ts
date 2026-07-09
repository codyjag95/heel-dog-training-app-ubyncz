// ============================================================
// HEEL Dog Training - Breed Database
// ============================================================
// 160+ breeds, alphabetized, with training-specific data.
// Each breed includes attributes for quiz routing, a personalized
// insight paragraph for quiz results, breed-specific training tips,
// and common challenges mapped to HEEL categories.
//
// USAGE:
// - Quiz breed selector: map over BREEDS for dropdown
// - Quiz results screen: use breedInsight for personalized paragraph
// - Lesson tips: pull trainingTips to weave into lesson content
// - Quiz routing: use commonChallenges to prioritize categories
// ============================================================

export type BreedGroup =
  | 'herding'
  | 'sporting'
  | 'working'
  | 'toy'
  | 'terrier'
  | 'hound'
  | 'non-sporting'
  | 'mixed';

export type Size = 'small' | 'medium' | 'large' | 'giant';
export type EnergyLevel = 'low' | 'moderate' | 'high' | 'very_high';
export type Trainability = 'eager' | 'moderate' | 'independent' | 'stubborn';

export type BreedData = {
  id: string;
  name: string;
  group: BreedGroup;
  size: Size;
  energy: EnergyLevel;
  trainability: Trainability;
  breedInsight: string; // Shows on quiz results — personalized, empathetic, actionable
  trainingTips: string[]; // Breed-specific tips to weave into lessons
  commonChallenges: string[]; // Maps to HEEL categories for quiz routing
  exerciseNeeds: string; // One-liner for breed guide
  lifespan: string;
  weight: string;
};

// ============================================================
// HELPER: Generate a URL-safe ID from breed name
// ============================================================
// IDs are lowercase, underscored versions of the name.
// e.g., "Australian Shepherd" → "australian_shepherd"

const BREEDS: BreedData[] = [
  {
    id: 'affenpinscher',
    name: 'Affenpinscher',
    group: 'toy',
    size: 'small',
    energy: 'moderate',
    trainability: 'stubborn',
    breedInsight: "Affenpinschers are confident little dogs with big personalities. They're naturally curious and fearless, so training has to feel like a game. The second it feels like a drill, they check out. Short, playful sessions are your best bet. Push past their attention span and you'll both end up frustrated.",
    trainingTips: [
      'Keep sessions under 5 minutes. They lose interest fast and forcing it backfires on you.',
      'Use high-value treats like cheese or chicken instead of kibble. Affenpinschers are picky about what motivates them.',
      'Channel their natural curiosity with puzzle toys and scent games between training sessions.',
    ],
    commonChallenges: ['barking', 'stubbornness', 'resource_guarding'],
    exerciseNeeds: '30 minutes daily — short walks plus indoor play',
    lifespan: '12–15 years',
    weight: '7–10 lbs',
  },

  {
    id: 'afghan_hound',
    name: 'Afghan Hound',
    group: 'hound',
    size: 'large',
    energy: 'high',
    trainability: 'independent',
    breedInsight: "Afghan Hounds were bred to hunt by sight across vast terrain, making their own decisions without any human input. That independence isn't stubbornness. It's hardwired self-reliance from centuries of solo work. Training an Afghan requires patience and creativity. Positive reinforcement works. Harsh corrections don't. They'll just stop engaging with you completely.",
    trainingTips: [
      'Never use punishment-based methods. Afghans will simply walk away from the relationship.',
      'Train in low-distraction environments first. Their prey drive makes outdoor focus extremely difficult early on.',
      'Recall is your biggest challenge. Use a long line outdoors and build serious value for coming back with high-reward treats.',
    ],
    commonChallenges: ['recall', 'prey_drive', 'independence'],
    exerciseNeeds: '60–90 minutes daily — needs to run in a secure area',
    lifespan: '12–14 years',
    weight: '50–60 lbs',
  },

  {
    id: 'airedale_terrier',
    name: 'Airedale Terrier',
    group: 'terrier',
    size: 'large',
    energy: 'high',
    trainability: 'moderate',
    breedInsight: "Airedales are the largest terriers, and they've got the attitude to match. Smart, athletic, and easily bored. If you don't give them something to do, they'll invent their own entertainment. Trust me, you won't like what they come up with. Training needs to stay varied and challenging. They pick up new skills fast but hate doing the same thing twice.",
    trainingTips: [
      'Rotate exercises frequently. Airedales learn fast but get bored even faster.',
      'Use play as a reward alongside treats. Many Airedales are more toy-motivated than food-motivated.',
      'Start socialization early and keep it going. Airedales can develop dog-selectivity during adolescence even with a good foundation.',
    ],
    commonChallenges: ['digging', 'prey_drive', 'leash_pulling', 'boredom_destruction'],
    exerciseNeeds: '60+ minutes daily — hiking, running, active play',
    lifespan: '10–13 years',
    weight: '50–70 lbs',
  },

  {
    id: 'akita',
    name: 'Akita',
    group: 'working',
    size: 'large',
    energy: 'moderate',
    trainability: 'independent',
    breedInsight: "Akitas are loyal, powerful dogs with strong guarding instincts. They bond deeply to their family but tend to be aloof or wary around strangers. Training an Akita is really about building mutual respect. They won't follow commands just because you said so. They need to trust your leadership, and that trust gets earned through consistency. Not force.",
    trainingTips: [
      'Socialization is non-negotiable and must start early. Akitas without proper exposure can become reactive or aggressive with other dogs.',
      'Keep training sessions calm and confident. Raised voices or visible frustration will damage your relationship with an Akita.',
      'Focus heavily on impulse control. Their guarding instinct means they need to learn when NOT to react.',
    ],
    commonChallenges: ['dog_aggression', 'guarding', 'stubbornness', 'stranger_wariness'],
    exerciseNeeds: '45–60 minutes daily — moderate walks plus mental stimulation',
    lifespan: '10–13 years',
    weight: '70–130 lbs',
  },

  {
    id: 'alaskan_malamute',
    name: 'Alaskan Malamute',
    group: 'working',
    size: 'large',
    energy: 'high',
    trainability: 'stubborn',
    breedInsight: "Malamutes were bred to haul heavy loads across frozen wilderness. Built for endurance and independent decision-making, not for taking orders. Your Malamute is smart enough to learn anything, but they'll constantly test whether following your direction is actually worth their time. Training requires patience, high-value rewards, and an honest understanding that perfect obedience isn't really in this breed's DNA.",
    trainingTips: [
      'Never let a Malamute off-leash in an unfenced area. Their prey drive and independence make reliable recall nearly impossible.',
      'Exercise them before training sessions. A tired Malamute is a far more cooperative Malamute.',
      'Focus on "working for rewards." Make them earn meals, treats, and access to things they want through basic commands.',
    ],
    commonChallenges: ['pulling', 'prey_drive', 'digging', 'howling', 'escape_artist'],
    exerciseNeeds: '90+ minutes daily — heavy exercise, pulling sports, hiking',
    lifespan: '10–14 years',
    weight: '75–100 lbs',
  },

  {
    id: 'american_bulldog',
    name: 'American Bulldog',
    group: 'working',
    size: 'large',
    energy: 'high',
    trainability: 'moderate',
    breedInsight: "American Bulldogs are athletic, loyal, and genuinely eager to please their people. They respond well to confident, consistent training and thrive when they have a job to do. Early socialization is critical here. Their natural protectiveness can become a real problem without proper exposure to different people, dogs, and environments from a young age.",
    trainingTips: [
      'Start socialization before 16 weeks and never stop. Expose them to as many people and situations as possible.',
      'Be firm but fair. American Bulldogs respect confident leadership and shut down completely with harsh punishment.',
      'Channel their athleticism into training. They excel at tug games, fetch, and obstacle work as rewards.',
    ],
    commonChallenges: ['jumping', 'leash_pulling', 'dog_selectivity', 'overexcitement'],
    exerciseNeeds: '60–90 minutes daily — running, fetch, strength activities',
    lifespan: '10–12 years',
    weight: '60–100 lbs',
  },

  {
    id: 'american_cocker_spaniel',
    name: 'American Cocker Spaniel',
    group: 'sporting',
    size: 'medium',
    energy: 'moderate',
    trainability: 'eager',
    breedInsight: "Cocker Spaniels are sweet, people-oriented dogs who genuinely want to make you happy. One of the most trainable breeds around when you use positive methods. But they're also emotionally sensitive. A harsh correction can create a fearful, shut-down dog practically overnight. Keep training upbeat and reward-heavy, and your Cocker will be your most enthusiastic student.",
    trainingTips: [
      'Use a soft, encouraging voice. Cockers are extremely sensitive to tone and will shut down if you sound frustrated.',
      'Address resource guarding early if you see any signs of it. Some Cockers develop possessiveness over food and toys.',
      'Socialize them to handling. They need regular grooming, so get them comfortable with being touched everywhere from puppyhood.',
    ],
    commonChallenges: ['submissive_urination', 'separation_anxiety', 'resource_guarding', 'barking'],
    exerciseNeeds: '45–60 minutes daily — walks plus play sessions',
    lifespan: '10–14 years',
    weight: '20–30 lbs',
  },

  {
    id: 'american_eskimo_dog',
    name: 'American Eskimo Dog',
    group: 'non-sporting',
    size: 'small',
    energy: 'high',
    trainability: 'eager',
    breedInsight: "American Eskimo Dogs are brilliant, eager learners who actually enjoy the training process. They pick things up incredibly fast. That's a double-edged sword, though, because they learn bad habits just as quickly. Keep them mentally challenged and they'll thrive. Bore them and they'll bark, dig, and find creative ways to destroy your house.",
    trainingTips: [
      'Teach tricks early and often. Eskies love learning new things and it channels their intelligence into something useful.',
      'Address barking proactively with a solid "quiet" command. This breed is naturally very vocal.',
      'Socialize them extensively with strangers. Without early positive exposure, Eskies can become suspicious of new people.',
    ],
    commonChallenges: ['barking', 'stranger_wariness', 'separation_anxiety', 'boredom_destruction'],
    exerciseNeeds: '45–60 minutes daily — active play, training games, walks',
    lifespan: '13–15 years',
    weight: '10–35 lbs (varies by size variety)',
  },

  {
    id: 'american_pit_bull_terrier',
    name: 'American Pit Bull Terrier',
    group: 'terrier',
    size: 'medium',
    energy: 'high',
    trainability: 'eager',
    breedInsight: "Pit Bulls are incredibly people-focused dogs who live to make their owners happy. Strong, athletic, and surprisingly sensitive. Despite the reputation, they're one of the most trainable and eager-to-please breeds out there when given proper guidance. Your Pit Bull wants structure, consistency, and clear communication. Give them that and they'll exceed every expectation you had.",
    trainingTips: [
      'Socialization with other dogs is essential and ongoing. Some Pit Bulls develop dog-selectivity in adolescence even with a solid socialization foundation.',
      'Lean on their desire to please. Praise and play can be just as powerful as treats with this breed.',
      'Teach impulse control early. Their enthusiasm combined with their strength makes uncontrolled behavior a real management challenge.',
    ],
    commonChallenges: ['leash_pulling', 'jumping', 'dog_selectivity', 'overexcitement'],
    exerciseNeeds: '60–90 minutes daily — high-intensity play, fetch, tug, running',
    lifespan: '12–14 years',
    weight: '30–65 lbs',
  },

  {
    id: 'american_staffordshire_terrier',
    name: 'American Staffordshire Terrier',
    group: 'terrier',
    size: 'medium',
    energy: 'high',
    trainability: 'eager',
    breedInsight: "AmStaffs are confident, loyal companions who thrive with engaged owners. Muscular and powerful, but also deeply affectionate with their people. Training should put a heavy emphasis on impulse control and calm public behavior. Not because they're dangerous, but because their strength demands good manners. They learn quickly and respond best to reward-based methods.",
    trainingTips: [
      'Practice loose-leash walking religiously. An AmStaff who pulls is physically difficult to manage and creates real public perception issues.',
      'Tug is a great training reward, but teach a solid "drop it" first so the game has clear rules.',
      "Prioritize calm greetings with people. Their enthusiasm is endearing at home, but jumping on strangers isn't.",
    ],
    commonChallenges: ['leash_pulling', 'jumping', 'dog_selectivity', 'overexcitement'],
    exerciseNeeds: '60–90 minutes daily — running, tug, agility, fetch',
    lifespan: '12–16 years',
    weight: '40–70 lbs',
  },

  {
    id: 'australian_cattle_dog',
    name: 'Australian Cattle Dog',
    group: 'herding',
    size: 'medium',
    energy: 'very_high',
    trainability: 'eager',
    breedInsight: "Australian Cattle Dogs are working machines, bred to control cattle all day in harsh conditions. Your ACD has an engine that never stops and a brain that demands constant engagement. Without structured outlets, that drive turns into nipping, herding children, and destructive behavior. The good news? They're incredibly smart and will learn anything you teach them, fast.",
    trainingTips: [
      'Mental exercise matters just as much as physical. Puzzle feeders, training sessions, and scent work can tire them out when walks alone aren\'t cutting it.',
      'Address nipping and herding behavior immediately. Redirect onto toys. Never hands or ankles.',
      'Give them a job. ACDs without purpose become anxious and destructive. Daily training sessions are their job.',
    ],
    commonChallenges: ['nipping', 'herding_behavior', 'reactivity', 'hyperactivity', 'boredom_destruction'],
    exerciseNeeds: '90+ minutes daily — running, fetch, herding, agility',
    lifespan: '12–16 years',
    weight: '35–50 lbs',
  },

  {
    id: 'australian_labradoodle',
    name: 'Australian Labradoodle',
    group: 'mixed',
    size: 'medium',
    energy: 'high',
    trainability: 'eager',
    breedInsight: "Australian Labradoodles are a multi-generation cross that tends to be more consistent in temperament than first-generation Labradoodles. Typically friendly, intuitive, and excellent training partners. Their intelligence and people-focus make them popular therapy and service dogs. One thing people underestimate: grooming is a major, ongoing commitment with this breed.",
    trainingTips: [
      'Start grooming habituation immediately. Professional grooming every 6 to 8 weeks is mandatory, not optional.',
      'Lean into their social intelligence. Australian Labradoodles read people well and respond strongly to emotional cues during training.',
      'Provide plenty of mental stimulation. They\'re smarter than most owners expect going in.',
    ],
    commonChallenges: ['jumping', 'overexcitement', 'separation_anxiety', 'grooming_needs'],
    exerciseNeeds: '60+ minutes daily — walks, swimming, training, play',
    lifespan: '13–15 years',
    weight: '30–65 lbs',
  },

  {
    id: 'australian_shepherd',
    name: 'Australian Shepherd',
    group: 'herding',
    size: 'medium',
    energy: 'very_high',
    trainability: 'eager',
    breedInsight: "Australian Shepherds are brilliant working dogs bred to herd livestock. That means your Aussie has a natural instinct to chase, nip, and control movement. Everything that moves. They need both physical and mental exercise every single day, or that energy turns into destructive behavior, barking, and herding your kids around the living room. The good news? Aussies are among the most trainable breeds alive. With the right structure, all that drive becomes focus and obedience.",
    trainingTips: [
      'Train before exercise, not after. A slightly hungry, slightly energetic Aussie is the most focused learner you\'ll find.',
      'Redirect herding and nipping onto appropriate outlets. Frisbee, tug toys, and structured fetch are your best friends.',
      'Teach a solid "off switch." Aussies need to learn how to settle and relax, not just how to work. Practice calm mat training every day.',
      'Vary your training routine constantly. Aussies get bored with repetition and will start freelancing if sessions feel too predictable.',
    ],
    commonChallenges: ['nipping', 'herding_behavior', 'hyperactivity', 'boredom_destruction', 'barking', 'separation_anxiety'],
    exerciseNeeds: '90+ minutes daily — running, fetch, frisbee, agility, mental enrichment',
    lifespan: '12–15 years',
    weight: '40–65 lbs',
  },

  {
    id: 'basenji',
    name: 'Basenji',
    group: 'hound',
    size: 'small',
    energy: 'high',
    trainability: 'independent',
    breedInsight: "Basenjis are one of the oldest dog breeds on earth, and they've kept every bit of that ancient independence. They don't bark (they yodel), they groom themselves like cats, and they'll weigh your training request before deciding if it's worth their time. You're not commanding this dog. You're negotiating. Make training feel like their idea and you'll get remarkable results. Push too hard and they'll simply opt out.",
    trainingTips: [
      'Find what motivates YOUR Basenji. Some are food-driven, others prefer play. Many are neither, and you need to get creative.',
      'Never chase a Basenji who\'s gotten loose. They\'ll treat it as a game. Run the opposite direction or just sit down instead.',
      'Crate training is essential. Basenjis left unsupervised will destroy your home with surgical precision.',
    ],
    commonChallenges: ['recall', 'destruction', 'escape_artist', 'counter_surfing', 'independence'],
    exerciseNeeds: '60+ minutes daily — running, lure coursing, active play',
    lifespan: '13–14 years',
    weight: '22–24 lbs',
  },

  {
    id: 'basset_hound',
    name: 'Basset Hound',
    group: 'hound',
    size: 'medium',
    energy: 'low',
    trainability: 'stubborn',
    breedInsight: "The Basset Hound's nose runs the show. Full stop. They were bred to track scent for hours on end, and that drive is still very much alive. Training one takes patience and seriously high-value treats, because they're not naturally wired to please you the way a Lab is. They're not dumb. They're selective. Figure out what's worth their effort and work with that, not against it.",
    trainingTips: [
      'Use smelly, high-value treats. Bassets are scent-driven and bland kibble won\'t compete with whatever they\'re smelling on the ground.',
      'Keep sessions very short. 3 to 5 minutes max. They check out fast.',
      'Recall will be your biggest battle. Practice in enclosed spaces and never rely on off-leash recall near roads.',
    ],
    commonChallenges: ['recall', 'stubbornness', 'barking', 'howling', 'scent_distraction'],
    exerciseNeeds: '30–45 minutes daily — moderate walks, scent games',
    lifespan: '12–13 years',
    weight: '40–65 lbs',
  },

  {
    id: 'beagle',
    name: 'Beagle',
    group: 'hound',
    size: 'small',
    energy: 'high',
    trainability: 'stubborn',
    breedInsight: "That Beagle nose can override every command you've ever taught. Cheerful, social, and completely food-obsessed, they're actually pretty fun to train once you accept the deal: use food strategically and you can teach them almost anything. Just let go of the fantasy of reliable off-leash recall. That nose will always win. Work with the dog you have.",
    trainingTips: [
      'Always train with high-value food rewards. Beagles are among the most food-motivated breeds out there, and that\'s your superpower.',
      'Practice recall constantly, but never trust it in unfenced areas. Their nose will always win against your voice.',
      'Get on top of baying and howling early with a quiet command. Beagles are vocal and your neighbors will absolutely notice.',
    ],
    commonChallenges: ['recall', 'barking', 'howling', 'counter_surfing', 'scent_distraction', 'escape_artist'],
    exerciseNeeds: '60+ minutes daily — walks, scent games, fetch',
    lifespan: '10–15 years',
    weight: '20–30 lbs',
  },

  {
    id: 'belgian_malinois',
    name: 'Belgian Malinois',
    group: 'herding',
    size: 'large',
    energy: 'very_high',
    trainability: 'eager',
    breedInsight: "Belgian Malinois are built for intensity. They're the top choice for police and military worldwide, and that drive doesn't switch off just because they moved into your house. Your Mal needs a job every single day. Training, structured exercise, and mental challenges aren't optional extras. They're survival requirements. Skip them and you get a destructive, anxious, reactive dog. Meet them and you'll have the most responsive partner you've ever worked with.",
    trainingTips: [
      'Structure every single day. Mals thrive on routine and fall apart without it.',
      'Use tug and play as primary rewards. Many Mals are more toy-driven than food-driven.',
      'Impulse control is your number one training priority. Their intensity needs a reliable off switch.',
      'Socialize carefully and continuously. Without proper exposure, Mals can become overly protective or reactive.',
    ],
    commonChallenges: ['reactivity', 'overarousal', 'nipping', 'separation_anxiety', 'hyperactivity'],
    exerciseNeeds: '120+ minutes daily — running, training, bite work, agility, mental enrichment',
    lifespan: '14–16 years',
    weight: '40–80 lbs',
  },

  {
    id: 'bernedoodle',
    name: 'Bernedoodle',
    group: 'mixed',
    size: 'large',
    energy: 'moderate',
    trainability: 'eager',
    breedInsight: "Bernedoodles blend the Bernese Mountain Dog's gentle nature with the Poodle's smarts. Usually affectionate, playful, and pretty trainable. That said, some inherit Bernese stubbornness and others pick up Poodle anxiety. Watch your individual dog and adjust accordingly. Like all Doodles, coat maintenance is a real commitment.",
    trainingTips: [
      'Socialize early and widely. Some Bernedoodles inherit Bernese shyness with strangers.',
      'Start leash training before they reach full size. Bernedoodles can be large and pulling becomes unmanageable quickly.',
      'Use positive reinforcement consistently. They\'re sensitive dogs who remember harsh corrections.',
    ],
    commonChallenges: ['stubbornness', 'jumping', 'separation_anxiety', 'grooming_needs'],
    exerciseNeeds: '45–60 minutes daily — walks, play, training',
    lifespan: '12–15 years',
    weight: '50–90 lbs (standard)',
  },

  {
    id: 'bernese_mountain_dog',
    name: 'Bernese Mountain Dog',
    group: 'working',
    size: 'giant',
    energy: 'moderate',
    trainability: 'eager',
    breedInsight: "Bernese Mountain Dogs are gentle giants who genuinely want to please you. Sensitive, affectionate, and they respond beautifully to positive training. The catch is how fast they grow. A 100-pound dog who jumps on guests or pulls on leash isn't cute, it's a safety problem. Teach manners early, before the size becomes the issue.",
    trainingTips: [
      'Train leash manners before they hit full size. A pulling Berner can literally drag you off your feet.',
      'Use a gentle, encouraging approach. Berners are soft dogs who wilt under harsh correction.',
      'Socialize with different surfaces, sounds, and environments. Some Berners develop fear-based issues if under-socialized.',
    ],
    commonChallenges: ['jumping', 'leash_pulling', 'slow_maturity', 'fearfulness'],
    exerciseNeeds: '45–60 minutes daily — moderate walks, avoid overexertion in heat',
    lifespan: '7–10 years',
    weight: '70–115 lbs',
  },

  {
    id: 'bichon_frise',
    name: 'Bichon Frise',
    group: 'non-sporting',
    size: 'small',
    energy: 'moderate',
    trainability: 'eager',
    breedInsight: "Cheerful, playful, and completely in love with being the center of attention. Bichons train well with positive methods and their natural desire to perform makes trick training a blast. The one real sticking point is housebreaking. They're notoriously slow to potty train, so patience and a strict schedule aren't optional.",
    trainingTips: [
      'Be extremely patient with potty training. Bichons can take 6+ months to become reliable. Use a strict schedule and never punish accidents.',
      'Use their love of attention as a reward. Bichons often work harder for praise and play than for food.',
      'Address separation anxiety early. Bichons are companion dogs who can become destructive when left alone.',
    ],
    commonChallenges: ['potty_training', 'separation_anxiety', 'barking', 'attention_seeking'],
    exerciseNeeds: '30–45 minutes daily — short walks, indoor play',
    lifespan: '14–15 years',
    weight: '12–18 lbs',
  },

  {
    id: 'bloodhound',
    name: 'Bloodhound',
    group: 'hound',
    size: 'large',
    energy: 'moderate',
    trainability: 'stubborn',
    breedInsight: "Bloodhounds have the most powerful nose in the canine world, and it controls everything they do. Once they lock onto a scent, you cease to exist. Training one is an exercise in patience. They're not defying you. They're just genuinely more interested in what they're smelling. Learn to use that nose to your advantage and training sessions can actually be a lot of fun.",
    trainingTips: [
      'Incorporate scent work into training. Hide treats and let them find them. It satisfies their drive and teaches focus at the same time.',
      'Use a harness, not a collar. Bloodhounds pull hard and their loose neck skin makes collars ineffective and potentially harmful.',
      'Accept that recall may never be reliable off-leash. Always use a long line in open areas.',
    ],
    commonChallenges: ['pulling', 'recall', 'drooling', 'stubbornness', 'scent_distraction'],
    exerciseNeeds: '60+ minutes daily — long walks, scent trails',
    lifespan: '10–12 years',
    weight: '80–110 lbs',
  },

  {
    id: 'border_collie',
    name: 'Border Collie',
    group: 'herding',
    size: 'medium',
    energy: 'very_high',
    trainability: 'eager',
    breedInsight: "Border Collies are widely considered the most intelligent dog breed on earth. New commands in under five repetitions, remembered forever. That intelligence is a gift, but it comes with a price. A bored Border Collie develops obsessive behaviors, herds children, and dismantles your house. They need a job, and training is that job. Keep challenging them and you'll have the most incredible dog you've ever owned.",
    trainingTips: [
      'Mental stimulation matters more than physical exercise. A 30-minute training session tires a Border Collie more than an hour of running.',
      'Watch for obsessive behaviors (fixating on lights, shadows, spinning). Redirect immediately onto structured activities.',
      'Teach an off switch. Border Collies need to learn how to relax. It genuinely doesn\'t come naturally to them.',
      'Vary training constantly. They memorize patterns and will anticipate commands before you give them.',
    ],
    commonChallenges: ['herding_behavior', 'obsessive_behaviors', 'reactivity', 'nipping', 'hyperactivity'],
    exerciseNeeds: '120+ minutes daily — mental + physical, agility, herding, advanced training',
    lifespan: '12–15 years',
    weight: '30–55 lbs',
  },

  {
    id: 'border_terrier',
    name: 'Border Terrier',
    group: 'terrier',
    size: 'small',
    energy: 'high',
    trainability: 'moderate',
    breedInsight: "Don't let the size fool you. Border Terriers carry a surprising amount of drive in that small frame. More biddable than most terriers, though the independent streak is still there. They excel at agility, earth dog trials, and nosework. Keep training fun and fast-paced. They feed off your energy.",
    trainingTips: [
      'Secure your yard. Border Terriers dig under fences and can squeeze through surprisingly small gaps.',
      'Use a mix of food and play rewards. They have good food drive but also love tug and chase games.',
      'Practice recall around small animals. Their prey drive for squirrels, rabbits, and cats is strong.',
    ],
    commonChallenges: ['prey_drive', 'digging', 'escape_artist', 'barking'],
    exerciseNeeds: '60+ minutes daily — walks, play, digging opportunities',
    lifespan: '12–15 years',
    weight: '11–16 lbs',
  },

  {
    id: 'boston_terrier',
    name: 'Boston Terrier',
    group: 'non-sporting',
    size: 'small',
    energy: 'moderate',
    trainability: 'eager',
    breedInsight: "Boston Terriers are the class clown of the dog world. Smart, goofy, and completely desperate for your attention. They train beautifully with positive methods and their natural enthusiasm makes every session genuinely fun. Just watch that flat face in hot weather. Keep sessions cool and short in summer.",
    trainingTips: [
      'Use their goofiness as an asset. Bostons love trick training and will perform for laughs and treats all day.',
      'Watch for overheating during training. Their flat face makes breathing harder, so train in cool environments.',
      'Channel their energy into short, focused sessions. 10-minute bursts work better than long marathons.',
    ],
    commonChallenges: ['jumping', 'overexcitement', 'flatulence', 'stubbornness_when_hot'],
    exerciseNeeds: '30–45 minutes daily — walks and play, avoid extreme heat',
    lifespan: '11–13 years',
    weight: '12–25 lbs',
  },

  {
    id: 'boxer',
    name: 'Boxer',
    group: 'working',
    size: 'large',
    energy: 'high',
    trainability: 'moderate',
    breedInsight: "Boxers are big, bouncy, and perpetually puppyish. Many don't fully mature mentally until age 3. Loyal, protective, and incredibly fun, but that extended puppyhood means training requires real patience. They respond best to handlers who can match their energy and keep things playful. Boring, repetitive drills will get you absolutely nowhere.",
    trainingTips: [
      'Expect a long adolescence. Boxers mature slowly and will test boundaries well into their second year.',
      'Use play and physical interaction as rewards. Many Boxers value wrestling and tug more than treats.',
      'Focus heavily on jumping. Boxers are notorious jumpers and at 65+ pounds, this needs to be addressed early and consistently.',
    ],
    commonChallenges: ['jumping', 'overexcitement', 'leash_pulling', 'slow_maturity', 'mouthing'],
    exerciseNeeds: '60–90 minutes daily — running, play, avoid extreme heat',
    lifespan: '10–12 years',
    weight: '50–80 lbs',
  },

  {
    id: 'brittany',
    name: 'Brittany',
    group: 'sporting',
    size: 'medium',
    energy: 'very_high',
    trainability: 'eager',
    breedInsight: "Brittanys are bird dogs with endless energy and a genuine desire to work with you. They're sensitive, responsive, and pick up training quickly, but they need serious daily exercise. Without it, all that energy curdles into anxious, destructive behavior. A well-exercised Brittany is a dream to train. An under-exercised one is a nightmare to live with.",
    trainingTips: [
      'Exercise before training, always. A Brittany with pent-up energy cannot focus.',
      'Use a soft approach. Brittanys are emotionally sensitive and harsh corrections create anxiety.',
      'Introduce whistle recall early. It carries farther than your voice and Brittanys respond to it well.',
    ],
    commonChallenges: ['hyperactivity', 'separation_anxiety', 'whining', 'bird_obsession'],
    exerciseNeeds: '90+ minutes daily — running, field work, swimming, fetch',
    lifespan: '12–14 years',
    weight: '30–40 lbs',
  },

  {
    id: 'brussels_griffon',
    name: 'Brussels Griffon',
    group: 'toy',
    size: 'small',
    energy: 'moderate',
    trainability: 'moderate',
    breedInsight: "Tiny dog, enormous personality. Brussels Griffons bond intensely to one person and can become full-on velcro dogs who struggle with any separation. Training needs to be gentle and consistent. They're smart but very sensitive. If they sense frustration from you, they'll shut down completely.",
    trainingTips: [
      'Build independence gradually. Practice short separations from day one to prevent severe separation anxiety.',
      'Use tiny, high-value treats. Their small stomachs fill fast, so adjust portions accordingly.',
      'Be patient with potty training. Small breeds have small bladders and need more frequent opportunities.',
    ],
    commonChallenges: ['separation_anxiety', 'potty_training', 'resource_guarding', 'barking'],
    exerciseNeeds: '30 minutes daily — short walks and indoor play',
    lifespan: '12–15 years',
    weight: '8–10 lbs',
  },

  {
    id: 'bull_terrier',
    name: 'Bull Terrier',
    group: 'terrier',
    size: 'medium',
    energy: 'high',
    trainability: 'stubborn',
    breedInsight: "Bull Terriers are clownish, stubborn, and completely one of a kind. They operate on their own schedule and have a legendary talent for ignoring anything they find boring. When training finally clicks, though? It's genuinely magic. These dogs bring energy and humor to everything they do. Make it a game and they're fully on board.",
    trainingTips: [
      'Never get into a battle of wills. You won\'t win. Redirect and make the desired behavior more rewarding than the undesired one.',
      'Use high-energy play as a reward. Bull Terriers often prefer rough play to food.',
      'Watch for obsessive tail-chasing or spinning. Redirect immediately. Left unchecked, it turns compulsive fast.',
    ],
    commonChallenges: ['stubbornness', 'obsessive_behaviors', 'dog_selectivity', 'destruction'],
    exerciseNeeds: '60+ minutes daily — vigorous play, running, tug',
    lifespan: '11–13 years',
    weight: '50–70 lbs',
  },

  {
    id: 'bulldog',
    name: 'Bulldog (English)',
    group: 'non-sporting',
    size: 'medium',
    energy: 'low',
    trainability: 'stubborn',
    breedInsight: "Lovable, stubborn tanks. Bulldogs do everything at their own pace, and there's no rushing them. They're not lazy or dumb. They're just very deliberate about what they consider worth doing. Find what motivates them (usually food), keep sessions extremely short, and always train somewhere cool. Overheating is a real danger with this breed.",
    trainingTips: [
      'Keep sessions under 5 minutes and always in cool/air-conditioned spaces. Bulldogs overheat dangerously fast.',
      'Use the highest-value food rewards you can find. Bulldogs are food-motivated but selective.',
      'Don\'t mistake slow compliance for defiance. Bulldogs process commands at their own speed.',
    ],
    commonChallenges: ['stubbornness', 'overheating', 'resource_guarding', 'potty_training'],
    exerciseNeeds: '20–30 minutes daily — short walks, avoid heat entirely',
    lifespan: '8–10 years',
    weight: '40–50 lbs',
  },

  {
    id: 'bullmastiff',
    name: 'Bullmastiff',
    group: 'working',
    size: 'giant',
    energy: 'moderate',
    trainability: 'moderate',
    breedInsight: "Bullmastiffs are massive, powerful dogs with natural guarding instincts. Calm and gentle with family, genuinely imposing to strangers. Their size and protective nature make early training and socialization non-negotiable. A 130-pound dog that won't listen to you isn't a pet. It's a liability. Start training the day you bring them home.",
    trainingTips: [
      'Socialization is your #1 priority. Expose to many people, dogs, and environments before 4 months old.',
      'Train all basic commands before they reach full size. You cannot physically manage an untrained adult Bullmastiff.',
      'Use calm, confident energy. Bullmastiffs mirror their handler\'s emotions and respond poorly to excitement or frustration.',
    ],
    commonChallenges: ['guarding', 'leash_pulling', 'dog_selectivity', 'drooling', 'stubbornness'],
    exerciseNeeds: '45–60 minutes daily — moderate walks, avoid overexertion',
    lifespan: '7–9 years',
    weight: '100–130 lbs',
  },

  {
    id: 'cairn_terrier',
    name: 'Cairn Terrier',
    group: 'terrier',
    size: 'small',
    energy: 'high',
    trainability: 'moderate',
    breedInsight: "Scrappy, curious, and packing way more confidence than their size suggests. Cairn Terriers were bred to hunt vermin in Scottish rock piles, so tough, independent, and relentlessly persistent are basically their factory settings. Training needs to be upbeat and constantly varied. Cairns get bored with repetition but absolutely love learning new things.",
    trainingTips: [
      'Secure your yard completely. Cairns dig under fences and can fit through small gaps.',
      'Use their prey drive constructively with tug and chase games as training rewards.',
      'Keep training sessions short and fun. 5-minute sessions 3x per day beats one 15-minute session.',
    ],
    commonChallenges: ['digging', 'barking', 'prey_drive', 'stubbornness'],
    exerciseNeeds: '45–60 minutes daily — walks, play, digging outlets',
    lifespan: '13–15 years',
    weight: '13–14 lbs',
  },

  {
    id: 'cane_corso',
    name: 'Cane Corso',
    group: 'working',
    size: 'giant',
    energy: 'moderate',
    trainability: 'moderate',
    breedInsight: "Cane Corsos are powerful, intelligent guardians that need an experienced, confident handler. Deeply loyal to family, naturally suspicious of everyone else. Training isn't optional with this breed. It's a responsibility. An untrained Corso is a serious liability. A well-trained one is a magnificent companion. Start early, stay consistent, and never use fear or force.",
    trainingTips: [
      'Establish leadership through structure, not intimidation. Corsos respect consistent boundaries, not punishment.',
      'Socialize intensively and continuously. A Corso who hasn\'t met enough people will decide who\'s welcome and who isn\'t.',
      'Practice handling exercises daily. Vet visits, grooming, and physical examinations should never be a fight.',
    ],
    commonChallenges: ['guarding', 'stranger_aggression', 'dog_selectivity', 'leash_reactivity'],
    exerciseNeeds: '60+ minutes daily — walks, training, mental enrichment',
    lifespan: '9–12 years',
    weight: '85–120 lbs',
  },

  {
    id: 'catahoula_leopard_dog',
    name: 'Catahoula Leopard Dog',
    group: 'herding',
    size: 'large',
    energy: 'very_high',
    trainability: 'independent',
    breedInsight: "Catahoulas are intense, athletic working dogs bred to bay and catch wild hogs in Louisiana swamps. Not a breed for casual owners. Full stop. They need a confident handler, structured daily work, and extensive socialization. Skip any of that and they become destructive and potentially aggressive. Give them what they need and you'll have a loyal, intelligent partner who will work all day without complaint.",
    trainingTips: [
      'This is an experienced-owner breed. If this is your first dog, seek professional training support.',
      'Socialize relentlessly. Catahoulas can be territorial and wary without extensive positive exposure.',
      'Provide structured work daily. Catahoulas without a job create one, and you won\'t like their choice.',
    ],
    commonChallenges: ['territorial', 'dog_aggression', 'destruction', 'independence', 'high_drive'],
    exerciseNeeds: '90+ minutes daily — hard running, swimming, structured work',
    lifespan: '10–14 years',
    weight: '50–95 lbs',
  },

  {
    id: 'cavalier_king_charles_spaniel',
    name: 'Cavalier King Charles Spaniel',
    group: 'toy',
    size: 'small',
    energy: 'moderate',
    trainability: 'eager',
    breedInsight: "Cavaliers are the ultimate companion dogs. Gentle, affectionate, and genuinely eager to please. They train beautifully with positive methods and rarely give their owners any attitude. The main challenge is how deeply they attach to people, which can spiral into separation anxiety fast. Build independence early and your Cavalier will be the easiest dog you've ever trained.",
    trainingTips: [
      'Practice alone time from day one. Cavaliers bond intensely and separation anxiety is their #1 issue.',
      'Use gentle, encouraging tones. This breed is extremely sensitive to their handler\'s emotions.',
      'Keep them on leash near roads. Cavaliers have enough spaniel instinct to chase birds into traffic.',
    ],
    commonChallenges: ['separation_anxiety', 'resource_guarding', 'chasing'],
    exerciseNeeds: '30–45 minutes daily — gentle walks, play sessions',
    lifespan: '12–15 years',
    weight: '13–18 lbs',
  },

  {
    id: 'cavapoo',
    name: 'Cavapoo (Cavoodle)',
    group: 'mixed',
    size: 'small',
    energy: 'moderate',
    trainability: 'eager',
    breedInsight: "Cavapoos combine the Cavalier's sweet nature with the Poodle's intelligence into one lovable, trainable companion. Excellent first dogs. Great family pets. Their main vulnerability is separation anxiety. Both parent breeds bond deeply to people, so this trait doubles up in the mix. Building independence early isn't optional, it's essential.",
    trainingTips: [
      'Start alone-time training from day one. Cavapoos are prone to severe separation anxiety from both parent breeds.',
      'Use their food drive and desire to please. Cavapoos are naturally motivated learners.',
      'Socialize gently but thoroughly. Some inherit the Cavalier\'s shyness.',
    ],
    commonChallenges: ['separation_anxiety', 'barking', 'potty_training'],
    exerciseNeeds: '30–45 minutes daily — walks, play, training',
    lifespan: '12–15 years',
    weight: '9–25 lbs',
  },

  {
    id: 'chesapeake_bay_retriever',
    name: 'Chesapeake Bay Retriever',
    group: 'sporting',
    size: 'large',
    energy: 'high',
    trainability: 'moderate',
    breedInsight: "Chessies are the most independent and strong-willed of the retriever breeds. Unlike Labs and Goldens, they weren't bred to follow directions all day. They were bred to guard the boat and work in harsh conditions on their own. They respect a confident handler but won't tolerate wishy-washy leadership. Clear, consistent training from day one sets the foundation.",
    trainingTips: [
      'Be firm and consistent without being harsh. Chessies need to see you as a fair leader, not a pushover.',
      'Use swimming and water retrieves as high-value rewards when possible.',
      'Socialize more than you think necessary. Chessies can become territorial without extensive early exposure.',
    ],
    commonChallenges: ['guarding', 'stubbornness', 'dog_selectivity', 'territorial'],
    exerciseNeeds: '60–90 minutes daily — swimming, retrieving, running',
    lifespan: '10–13 years',
    weight: '55–80 lbs',
  },

  {
    id: 'chihuahua',
    name: 'Chihuahua',
    group: 'toy',
    size: 'small',
    energy: 'moderate',
    trainability: 'stubborn',
    breedInsight: "Tiny but absolutely fierce. Chihuahuas have no idea they're small and will try to boss around dogs ten times their size. The biggest mistake owners make is skipping training because they're 'just a small dog.' An untrained Chihuahua develops resource guarding, fear-based aggression, and excessive barking. Train them like a big dog in a small body and you'll have a surprisingly capable companion.",
    trainingTips: [
      'Train them on the ground, not in your arms. Carrying them everywhere prevents socialization and builds fear.',
      'Use tiny treats. Their caloric needs are minimal and it\'s easy to overfeed during training.',
      'Socialize extensively with other dogs AND people. Fear-based reactivity is the #1 Chihuahua problem and it\'s preventable.',
    ],
    commonChallenges: ['barking', 'fear_aggression', 'resource_guarding', 'potty_training', 'reactivity'],
    exerciseNeeds: '20–30 minutes daily — short walks, indoor play',
    lifespan: '14–16 years',
    weight: '2–6 lbs',
  },

  {
    id: 'chinese_crested',
    name: 'Chinese Crested',
    group: 'toy',
    size: 'small',
    energy: 'moderate',
    trainability: 'eager',
    breedInsight: "Chinese Cresteds are affectionate, playful dogs who bond deeply with their owners. Surprisingly athletic for their size. They genuinely enjoy agility and trick training. But be careful with your tone: this breed is extremely sensitive, and they'll remember a harsh correction for months. Always positive, always gentle.",
    trainingTips: [
      'Use exclusively positive methods. Cresteds are extremely sensitive and shut down with any punishment.',
      'Protect their skin during outdoor training. Sunburn and cold are real concerns for hairless varieties.',
      'Build confidence through trick training. Cresteds love performing and it helps with their natural shyness.',
    ],
    commonChallenges: ['separation_anxiety', 'shyness', 'potty_training', 'barking'],
    exerciseNeeds: '30 minutes daily — indoor play, short walks',
    lifespan: '13–18 years',
    weight: '8–12 lbs',
  },

  {
    id: 'chow_chow',
    name: 'Chow Chow',
    group: 'non-sporting',
    size: 'medium',
    energy: 'low',
    trainability: 'independent',
    breedInsight: "People compare Chow Chows to cats, and honestly, it fits. Dignified and independent, loyal to family, and thoroughly aloof with strangers. They have no natural desire to please. Training a Chow is about mutual respect. They'll cooperate when they see the benefit, not because you demanded it. Early socialization is critical. An unsocialized Chow can become aggressive.",
    trainingTips: [
      'Start socialization and handling exercises from 8 weeks. Chows who aren\'t handled early become difficult for vets and groomers.',
      'Respect their independence. Short, purposeful training sessions work better than long ones.',
      'Never physically force a Chow into a position. Use luring and shaping instead.',
    ],
    commonChallenges: ['stranger_aggression', 'dog_selectivity', 'stubbornness', 'handling_sensitivity'],
    exerciseNeeds: '30–45 minutes daily — moderate walks, avoid heat',
    lifespan: '8–12 years',
    weight: '45–70 lbs',
  },

  {
    id: 'cockapoo',
    name: 'Cockapoo',
    group: 'mixed',
    size: 'small',
    energy: 'moderate',
    trainability: 'eager',
    breedInsight: "Cockapoos are cheerful, social dogs combining the Cocker Spaniel's eagerness with the Poodle's smarts. Generally easy to train and a great pick for first-time owners. Just know that both parent breeds bring some baggage: the Cocker's tendency toward resource guarding and the Poodle's anxiety can both show up in the mix.",
    trainingTips: [
      'Monitor for resource guarding around food and toys. Address it early with trading games if you see signs.',
      'Keep grooming positive from the start. Cockapoos need regular professional grooming.',
      'Use their social nature. They train best with lots of human interaction and praise.',
    ],
    commonChallenges: ['resource_guarding', 'separation_anxiety', 'barking', 'grooming_needs'],
    exerciseNeeds: '30–45 minutes daily — walks, play, mental enrichment',
    lifespan: '12–15 years',
    weight: '12–25 lbs',
  },

  {
    id: 'cocker_spaniel_english',
    name: 'Cocker Spaniel (English)',
    group: 'sporting',
    size: 'medium',
    energy: 'high',
    trainability: 'eager',
    breedInsight: "English Cockers are the more driven, more athletic version of the American Cocker. They were built for fieldwork, and that sporting engine runs hot. They want to please you, they learn fast, and they'll be excellent training partners. The catch is they tip into overstimulation quickly, so teaching a settle and calm behavior isn't optional. Build it in from day one.",
    trainingTips: [
      'Channel their energy into structured activities. English Cockers need both physical and mental outlets every day.',
      'Practice calm greetings from puppyhood. Their excitement when meeting people escalates fast if left unchecked.',
      'Use retrieval games as training rewards. Their sporting instinct makes fetch one of the most powerful motivators you have.',
    ],
    commonChallenges: ['overexcitement', 'resource_guarding', 'barking', 'separation_anxiety'],
    exerciseNeeds: '60+ minutes daily — walks, field work, swimming, fetch',
    lifespan: '12–14 years',
    weight: '26–34 lbs',
  },

  {
    id: 'collie',
    name: 'Collie (Rough/Smooth)',
    group: 'herding',
    size: 'large',
    energy: 'moderate',
    trainability: 'eager',
    breedInsight: "Collies are gentle, emotionally intelligent herding dogs with a natural radar for how their family is feeling. They're great with kids, easy to train, and genuinely want to do the right thing. The two things to watch are barking and sensitivity. Collies are vocal communicators, and a sharp correction can make them shut down completely. Go patient and positive with this breed and they'll absorb everything you teach them.",
    trainingTips: [
      'Teach a "quiet" cue with positive reinforcement. Collies bark to communicate and punishing it creates anxiety, not silence.',
      'Lean heavily on praise as a reward. Collies are more people-motivated than most breeds and your approval genuinely matters to them.',
      'Keep socialization going past puppyhood. Some Collies develop shyness without regular positive exposure to new people and places.',
    ],
    commonChallenges: ['barking', 'shyness', 'herding_behavior', 'sensitivity'],
    exerciseNeeds: '45–60 minutes daily — walks, play, herding activities',
    lifespan: '12–14 years',
    weight: '50–75 lbs',
  },

  {
    id: 'corgi_cardigan',
    name: 'Corgi (Cardigan Welsh)',
    group: 'herding',
    size: 'small',
    energy: 'high',
    trainability: 'eager',
    breedInsight: "Cardigans are the older, slightly calmer cousin of the Pembroke. Slightly. They're still fully herding dogs with real drive and plenty of opinions. The biggest difference is they tend to be more reserved around strangers, so socialization matters even more with this breed. Get that right and you've got a loyal, trainable dog who genuinely thrives with structure.",
    trainingTips: [
      'Socialize with strangers more than you think necessary. Cardigans can become wary and suspicious without steady positive exposure.',
      'Manage the nipping the same way you would with a Pembroke. Redirect those herding instincts onto toys and structured games.',
      'Protect their backs. Skip the furniture jumping and manage stairs carefully during the growth phase.',
    ],
    commonChallenges: ['nipping', 'barking', 'stranger_wariness', 'weight_management'],
    exerciseNeeds: '60+ minutes daily — walks, play, herding games',
    lifespan: '12–15 years',
    weight: '25–38 lbs',
  },

  {
    id: 'corgi_pembroke',
    name: 'Corgi (Pembroke Welsh)',
    group: 'herding',
    size: 'small',
    energy: 'high',
    trainability: 'eager',
    breedInsight: "Pembroke Corgis are full herding dogs stuffed into a compact body, and they have absolutely not forgotten that. Smart, bossy, and loaded with energy that surprises most new owners. Nipping at heels, barking, trying to control movement in the house, that's all herding instinct. Redirect it consistently and you've got a fantastic dog. Ignore it and they will run your household.",
    trainingTips: [
      'Redirect nipping the moment it starts. Corgis nip ankles by instinct. It\'s herding behavior, not aggression, but it needs to be managed early.',
      'Watch the weight carefully. Corgis gain it easily and extra pounds on a long back is a real problem.',
      'Use their food drive to your advantage. Corgis are extremely food-motivated, which makes shaping behaviors pretty straightforward.',
    ],
    commonChallenges: ['nipping', 'barking', 'herding_behavior', 'weight_management', 'stubbornness'],
    exerciseNeeds: '60+ minutes daily — walks, play, mental enrichment',
    lifespan: '12–13 years',
    weight: '25–30 lbs',
  },

  {
    id: 'dachshund',
    name: 'Dachshund',
    group: 'hound',
    size: 'small',
    energy: 'moderate',
    trainability: 'stubborn',
    breedInsight: "Picture this: a dog bred to go underground, alone, in the dark, hunting badgers without any guidance from a human. That's a Dachshund. That fearless, self-sufficient mindset is baked in, and it's exactly why training them is famously frustrating. They're not being stubborn to spite you. They genuinely believe they know better. Food rewards and patience are your only real tools here, and protecting that long back from stairs and jumping is non-negotiable.",
    trainingTips: [
      'Use the best treats you can find. Dachshunds are food-obsessed and that\'s your primary leverage in training.',
      'Prevent back injuries at all costs. Use ramps instead of stairs and discourage jumping on and off furniture.',
      'Be patient with potty training. Dachshunds are notoriously slow to housetrain, and wet or cold weather makes it even harder.',
    ],
    commonChallenges: ['potty_training', 'barking', 'stubbornness', 'digging', 'back_injuries'],
    exerciseNeeds: '30–45 minutes daily — moderate walks, avoid jumping',
    lifespan: '12–16 years',
    weight: '16–32 lbs (standard), 8–11 lbs (mini)',
  },

  {
    id: 'dalmatian',
    name: 'Dalmatian',
    group: 'non-sporting',
    size: 'large',
    energy: 'very_high',
    trainability: 'moderate',
    breedInsight: "Dalmatians were bred to run alongside carriages for miles. That endurance is very much still present. They're athletes in the truest sense, and an under-exercised Dalmatian becomes a destructive, chaotic handful fast. Get the exercise right and you'll find a loyal, trainable, and genuinely affectionate companion underneath all that energy. Exercise first, train second, every single time.",
    trainingTips: [
      'Run them before asking them to focus. A Dalmatian with pent-up energy is physically incapable of settling into training.',
      'Socialize early and keep it going. Some Dalmatians develop nervousness or reactivity without steady positive exposure to new situations.',
      'Check their hearing early. Around 30% of Dalmatians have some degree of hearing loss, and that changes your training approach significantly.',
    ],
    commonChallenges: ['hyperactivity', 'destruction', 'deafness', 'reactivity', 'jumping'],
    exerciseNeeds: '90+ minutes daily — running, cycling, hiking, swimming',
    lifespan: '11–13 years',
    weight: '45–70 lbs',
  },

  {
    id: 'doberman_pinscher',
    name: 'Doberman Pinscher',
    group: 'working',
    size: 'large',
    energy: 'high',
    trainability: 'eager',
    breedInsight: "Few breeds can match a Doberman in raw trainability. Fast learners, desperate to please, and bonded to their handler in a way that makes work feel effortless once you've built that relationship. But they're also powerful and protective, and they need clear structure from day one. A well-trained Doberman is one of the most impressive dogs you'll ever see. An untrained one is a serious problem. Confidence and consistency are the job requirements for this breed.",
    trainingTips: [
      'Start obedience training immediately. Dobermans grow fast and bad habits need to be addressed well before they reach full size.',
      'Socialize extensively with people and places. Their natural guarding instinct needs to be shaped through exposure, not ignored.',
      'Mix food and play rewards. Dobermans are versatile in what motivates them, and variety keeps their attention sharp.',
      'Train calm behavior on purpose. Without structured relaxation practice, Dobermans can tip into anxiety and neurotic patterns.',
    ],
    commonChallenges: ['separation_anxiety', 'guarding', 'reactivity', 'leash_pulling'],
    exerciseNeeds: '60–90 minutes daily — running, training, agility, mental work',
    lifespan: '10–12 years',
    weight: '60–100 lbs',
  },

  {
    id: 'dogo_argentino',
    name: 'Dogo Argentino',
    group: 'working',
    size: 'large',
    energy: 'high',
    trainability: 'moderate',
    breedInsight: "Dogos are powerful, athletic dogs built for big-game hunting. With their family they're loyal and deeply affectionate. Outside that circle, they require experienced, confident handling. Early socialization and consistent training aren't just recommended, they're mandatory. Their strength and prey drive are real, and a handler who isn't clear and fair will struggle with this breed.",
    trainingTips: [
      'Socialize with other dogs carefully and early. Dogos can develop same-sex aggression as they hit adolescence.',
      'Use positive reinforcement, but hold firm on boundaries. This breed reads inconsistency immediately and will test it.',
      'Impulse control is essential. Work on wait, leave it, and stay until they\'re rock solid.',
    ],
    commonChallenges: ['dog_aggression', 'prey_drive', 'guarding', 'leash_pulling'],
    exerciseNeeds: '60–90 minutes daily — running, structured play, mental work',
    lifespan: '9–15 years',
    weight: '80–100 lbs',
  },

  {
    id: 'dutch_shepherd',
    name: 'Dutch Shepherd',
    group: 'herding',
    size: 'large',
    energy: 'very_high',
    trainability: 'eager',
    breedInsight: "Think of Dutch Shepherds as a Malinois with slightly more of an off switch. Still incredibly athletic, still highly intelligent, still very eager to work. They shine in protection sports, agility, and obedience. The energy and drive are very much there and need structured outlets every day, but many owners find them a bit more manageable than a true Malinois.",
    trainingTips: [
      'Give them structured work daily. Dutch Shepherds need a real job, whether that\'s training sessions, dog sports, or active tasks with you.',
      'Socialize thoroughly. Their natural watchfulness needs plenty of positive exposure to strangers before it becomes over-guarding.',
      'Mix food and toy rewards. Dutch Shepherds are versatile in what motivates them, so use both.',
    ],
    commonChallenges: ['reactivity', 'herding_behavior', 'overarousal', 'nipping'],
    exerciseNeeds: '90+ minutes daily — running, training, sports, mental work',
    lifespan: '11–14 years',
    weight: '42–75 lbs',
  },

  {
    id: 'english_bulldog',
    name: 'English Bulldog',
    group: 'non-sporting',
    size: 'medium',
    energy: 'low',
    trainability: 'stubborn',
    breedInsight: "English Bulldogs are lovable, stubborn companions who overheat faster than almost any other breed. Short, cool training sessions with high-value treats are basically the only approach that works with them. They'll charm you into letting things slide, so you have to be more consistent than feels necessary. That stubbornness has a ceiling though. Find the right treat and keep sessions brief, and they'll actually surprise you.",
    trainingTips: [
      'Train indoors in air conditioning. Bulldogs overheat dangerously fast and simply cannot work in warm conditions.',
      'Use the best treats you have. Bulldogs are food-motivated but selective, so quality matters.',
      'Be patient with housetraining. Bulldogs take longer than most breeds to get reliable on this.',
    ],
    commonChallenges: ['stubbornness', 'overheating', 'resource_guarding', 'potty_training'],
    exerciseNeeds: '20–30 minutes daily — very short walks, avoid all heat',
    lifespan: '8–10 years',
    weight: '40–50 lbs',
  },

  {
    id: 'english_springer_spaniel',
    name: 'English Springer Spaniel',
    group: 'sporting',
    size: 'medium',
    energy: 'high',
    trainability: 'eager',
    breedInsight: "Springers are pure joy in dog form. High-energy, eager to please, and one of the most trainable sporting breeds you'll find. They genuinely love to work and their enthusiasm is contagious. The main thing to get right is exercise. A Springer who doesn't get enough physical outlet will find their own ways to burn it off, and you won't like their choices.",
    trainingTips: [
      'Build in structured retrieval and scent work. Springers are happiest when using their natural abilities and it doubles as great training.',
      'Address separation anxiety before it takes root. Springers bond deeply and can really struggle when left alone.',
      'Know about rage syndrome. It\'s rare, but some lines carry this genetic condition. Sudden unprovoked aggression with no warning signs warrants a call to a veterinary behaviorist.',
    ],
    commonChallenges: ['separation_anxiety', 'hyperactivity', 'jumping', 'resource_guarding'],
    exerciseNeeds: '60–90 minutes daily — running, swimming, retrieving',
    lifespan: '12–14 years',
    weight: '40–50 lbs',
  },

  {
    id: 'french_bulldog',
    name: 'French Bulldog',
    group: 'non-sporting',
    size: 'small',
    energy: 'low',
    trainability: 'moderate',
    breedInsight: "French Bulldogs are charming, adaptable, and genuinely fun to live with. The most popular breed in America for a reason. Affectionate, apartment-friendly, and easier to train than their stubborn reputation suggests. The real challenges are the heat sensitivity (flat face means limited airflow), their occasional decision that they're just done with training today, and honestly, the fact that they're so cute it's hard to hold a boundary when they give you that look.",
    trainingTips: [
      'Keep training sessions short and do them in cool environments. Frenchies overheat dangerously fast, especially with any physical activity.',
      'Use food as your main motivator. Frenchies are very food-driven and training becomes surprisingly effective when you lean into that.',
      'Don\'t let cute behavior slide. Frenchies are world-class at getting away with bad habits because they look ridiculous doing them. Hold the line anyway.',
    ],
    commonChallenges: ['stubbornness', 'overheating', 'potty_training', 'separation_anxiety', 'flatulence'],
    exerciseNeeds: '20–30 minutes daily — short walks, indoor play, NO heat',
    lifespan: '10–12 years',
    weight: '16–28 lbs',
  },

  {
    id: 'german_shepherd',
    name: 'German Shepherd Dog',
    group: 'herding',
    size: 'large',
    energy: 'high',
    trainability: 'eager',
    breedInsight: "German Shepherds can do almost anything. Obedience, protection work, scent detection, agility, therapy, search and rescue. They're fiercely loyal and one of the most intelligent breeds alive. But that capability comes with real demands. They need structure, exercise, socialization, and clear leadership from their owner. A GSD without direction develops anxiety and reactivity fast. Give them direction and they become the most capable partner you could ask for.",
    trainingTips: [
      'Socialize relentlessly during the critical window, 8 to 16 weeks especially. GSDs are prone to fear-based reactivity when under-socialized early.',
      'Add mental work on top of physical exercise every day. Nose work, training drills, and puzzle toys are not optional for this breed.',
      'Build confidence gently in puppyhood. Despite their tough reputation, many GSDs are actually sensitive, nervy dogs underneath and they need that foundation.',
      'Stay away from protection training unless you\'re working with a qualified professional. Their natural guarding instinct doesn\'t need any encouragement.',
    ],
    commonChallenges: ['reactivity', 'separation_anxiety', 'barking', 'leash_pulling', 'nervousness'],
    exerciseNeeds: '90+ minutes daily — running, training, mental work, structured activities',
    lifespan: '7–10 years',
    weight: '50–90 lbs',
  },

  {
    id: 'german_shorthaired_pointer',
    name: 'German Shorthaired Pointer',
    group: 'sporting',
    size: 'large',
    energy: 'very_high',
    trainability: 'eager',
    breedInsight: "GSPs are athletic powerhouses with a serious need to run, hunt, and work. Brilliant, eager, and genuinely affectionate dogs. But they need more exercise than most owners ever expect. An hour walk? That's just a warm-up. Without proper outlets a GSP will dismantle your house, clear your fence, and be three neighborhoods away before you notice. Get the exercise right and they're one of the most rewarding breeds on the planet.",
    trainingTips: [
      'Exercise them hard before expecting any focus. A GSP with energy left in the tank is physically incapable of settling into training.',
      'Use prey drive constructively. Retrieve games, scent trails, and hunting simulations give those instincts somewhere to go.',
      'Never leave a bored GSP alone with yard access. They\'re expert escape artists and will clear a 6-foot fence without hesitation.',
    ],
    commonChallenges: ['hyperactivity', 'escape_artist', 'destruction', 'jumping', 'pulling'],
    exerciseNeeds: '120+ minutes daily — running, swimming, field work, hard exercise',
    lifespan: '12–14 years',
    weight: '45–70 lbs',
  },

  {
    id: 'german_wirehaired_pointer',
    name: 'German Wirehaired Pointer',
    group: 'sporting',
    size: 'large',
    energy: 'very_high',
    trainability: 'eager',
    breedInsight: "Wirehaired Pointers are rugged, versatile hunting dogs with even more drive and independence than their Shorthaired cousins. They bond intensely with one person and can be genuinely aloof with everyone else. Confidence and consistency are non-negotiable with this breed. They'll immediately respect a firm, fair leader. They'll test an uncertain one until something breaks.",
    trainingTips: [
      'Establish clear leadership early. GWPs test limits more actively than GSPs and they need to know where you stand.',
      'Exercise hard before training sessions. They need serious physical work before they can focus.',
      'Socialize with a wide variety of people. Without broad exposure, GWPs can lock in as true one-person dogs.',
    ],
    commonChallenges: ['hyperactivity', 'independence', 'guarding', 'prey_drive'],
    exerciseNeeds: '90+ minutes daily — hard running, swimming, hunting simulations',
    lifespan: '12–14 years',
    weight: '50–70 lbs',
  },

  {
    id: 'golden_retriever',
    name: 'Golden Retriever',
    group: 'sporting',
    size: 'large',
    energy: 'high',
    trainability: 'eager',
    breedInsight: "Golden Retrievers are about as close to a perfect training partner as dogs get. Forgiving when you mess up, eager to please, and relentlessly optimistic. They're the ideal first dog and respond well to almost any positive approach. The challenge isn't actually teaching them anything. It's managing all that enthusiasm. Jumping, mouthing, and overexcitement are classic Golden problems, and they all come from the same place: this dog loves you, loves everyone, loves everything, and has no idea how to turn it down.",
    trainingTips: [
      'Make calm greetings a priority. Goldens love people so intensely that jumping and mouthing become their biggest training issues.',
      'Use retrieval as a training reward. Goldens want something in their mouth. Teach them to carry a toy when guests arrive.',
      'Exercise them every day with structure. A bored Golden will work through your furniture, shoes, and baseboards methodically.',
    ],
    commonChallenges: ['jumping', 'mouthing', 'overexcitement', 'pulling', 'counter_surfing'],
    exerciseNeeds: '60–90 minutes daily — running, swimming, fetch, training',
    lifespan: '10–12 years',
    weight: '55–75 lbs',
  },

  {
    id: 'goldendoodle',
    name: 'Goldendoodle',
    group: 'mixed',
    size: 'large',
    energy: 'high',
    trainability: 'eager',
    breedInsight: "Goldendoodles blend the Golden Retriever's people-pleasing warmth with the Poodle's sharp intelligence and energy. Most of them are genuinely great training partners. The thing to know is their temperament varies more than you'd see in a purebred. Some lean Poodle, smart but occasionally anxious. Others lean Golden, eager but sometimes a tornado. Watch your individual dog early and adjust your approach to who they actually are.",
    trainingTips: [
      'Don\'t assume hypoallergenic means low-maintenance. Goldendoodles need real grooming attention and many need daily brushing to avoid serious matting.',
      'Jump on jumping early. Most Goldendoodles are exuberant greeters and that habit gets baked in fast if you don\'t address it.',
      'Socialize thoroughly. Some Goldendoodles pull in Poodle nervousness and need extra positive exposure to strangers to build real confidence.',
    ],
    commonChallenges: ['jumping', 'mouthing', 'overexcitement', 'separation_anxiety'],
    exerciseNeeds: '60–90 minutes daily — walking, running, swimming, fetch',
    lifespan: '10–15 years',
    weight: '50–90 lbs (standard)',
  },

  {
    id: 'great_dane',
    name: 'Great Dane',
    group: 'working',
    size: 'giant',
    energy: 'moderate',
    trainability: 'eager',
    breedInsight: "Great Danes grow at a pace that's almost hard to believe. A 10-pound puppy becomes a 120-pound adult in roughly 18 months. That timeline matters a lot, because everything needs to be trained before they reach full size. You cannot physically manage an untrained adult Dane. Underneath all that size, though, is a genuinely sensitive and sweet-natured dog who responds beautifully to calm, consistent handling.",
    trainingTips: [
      'Train all manners during puppyhood, no exceptions. Leash walking, no jumping, and doorway manners must be solid before they outweigh you.',
      'Teach a reliable "off" command immediately. A Great Dane that jumps on people can put someone on the ground.',
      'Stay gentle in corrections. Danes are emotionally sensitive and shut down fast when pushed too hard.',
    ],
    commonChallenges: ['jumping', 'counter_surfing', 'leash_pulling', 'slow_maturity', 'fearfulness'],
    exerciseNeeds: '45–60 minutes daily — moderate walks, avoid strenuous exercise during growth',
    lifespan: '7–10 years',
    weight: '110–175 lbs',
  },

  {
    id: 'great_pyrenees',
    name: 'Great Pyrenees',
    group: 'working',
    size: 'giant',
    energy: 'low',
    trainability: 'independent',
    breedInsight: "Great Pyrenees were bred to patrol mountainsides at night, alone, guarding livestock without any human oversight. They made their own calls. That independence is not a training problem you can fix. It's the entire point of the breed. They're not stubborn the way a terrier is stubborn. They actually evaluate whether your command makes logical sense before deciding to comply. Training a Pyr is about building a real partnership, not demanding obedience.",
    trainingTips: [
      'Accept early that off-leash reliability is extremely difficult with this breed. A long line or fenced area is your practical solution.',
      'Nighttime barking is pure instinct, not a behavior problem. Manage it through the environment (bring them inside at night) rather than trying to train it away.',
      'Use calm, patient repetition. Pyrs learn on their own timeline and any pressure or rushing just creates resistance.',
    ],
    commonChallenges: ['barking', 'independence', 'escape_artist', 'stubbornness', 'nighttime_guarding'],
    exerciseNeeds: '30–45 minutes daily — moderate walks, they conserve energy by nature',
    lifespan: '10–12 years',
    weight: '85–120 lbs',
  },

  {
    id: 'great_swiss_mountain_dog',
    name: 'Greater Swiss Mountain Dog',
    group: 'working',
    size: 'giant',
    energy: 'moderate',
    trainability: 'moderate',
    breedInsight: "Swissies are large, confident working dogs originally bred for drafting and guarding farm property. They're calmer than a lot of working breeds, which is a nice thing. But they still need structure and socialization, and the same rule applies as with all giant breeds: everything has to be trained before they hit full size. Get that right and you have a loyal, watchful, and surprisingly gentle companion.",
    trainingTips: [
      'Train all manners in puppyhood. At 100-plus pounds, habits you let slide become genuinely unmanageable.',
      'Socialize broadly with many people. Their watchdog instinct needs consistent positive exposure to stay balanced and not tip into over-guarding.',
      'Use food rewards freely. Swissies are typically food-motivated and respond well to it.',
    ],
    commonChallenges: ['pulling', 'jumping', 'guarding', 'slow_maturity'],
    exerciseNeeds: '45–60 minutes daily — moderate walks, pulling activities, avoid extreme heat',
    lifespan: '8–11 years',
    weight: '85–140 lbs',
  },

  {
    id: 'greyhound',
    name: 'Greyhound',
    group: 'hound',
    size: 'large',
    energy: 'low',
    trainability: 'moderate',
    breedInsight: "The world's fastest couch potato. A dog that can hit 45 mph genuinely prefers to sleep 18 hours a day and drape themselves across your furniture like a furry scarf. If yours came from racing, they're learning pet life from scratch. Stairs, glass doors, random household noises. All brand new. Go slow, stay gentle, and give them time to figure out this whole home life thing.",
    trainingTips: [
      'Racing adopters, budget extra time for the transition. House manners, leash walking, and basic home life are genuinely new territory for them.',
      'Never let a Greyhound off-leash in an unfenced area. Prey drive kicks in instantly, they hit full speed in seconds, and recall means nothing once they are running.',
      'Positive methods only. Greyhounds are sensitive souls and any harsh correction shuts them down completely.',
    ],
    commonChallenges: ['prey_drive', 'recall', 'shyness', 'separation_anxiety', 'stairs'],
    exerciseNeeds: '30–45 minutes daily — short walks, occasional sprints in fenced area',
    lifespan: '10–14 years',
    weight: '60–70 lbs',
  },

  {
    id: 'havanese',
    name: 'Havanese',
    group: 'toy',
    size: 'small',
    energy: 'moderate',
    trainability: 'eager',
    breedInsight: "Cheerful, clever little performers who genuinely love showing off for their people. Tricks come fast, they want to please, and training sessions feel more like play than work. Two things will test you: potty training drags on longer than you'd expect from such a smart dog (small bladder, surprisingly stubborn attitude), and they want to be attached to you every single hour of the day.",
    trainingTips: [
      'Be patient with housebreaking. A strict schedule with outdoor trips every 2 hours for puppies is the bare minimum.',
      'Lean into their love of tricks. Havanese are born performers and trick training builds confidence and deepens your bond.',
      'Practice alone time from day one. A Havanese who is never separated from their owner will develop serious separation anxiety down the road.',
    ],
    commonChallenges: ['potty_training', 'separation_anxiety', 'barking', 'attention_seeking'],
    exerciseNeeds: '30 minutes daily — walks and play sessions',
    lifespan: '14–16 years',
    weight: '7–13 lbs',
  },

  {
    id: 'irish_setter',
    name: 'Irish Setter',
    group: 'sporting',
    size: 'large',
    energy: 'very_high',
    trainability: 'moderate',
    breedInsight: "Gorgeous, athletic dogs who experience life at full volume. They're also one of the slowest-maturing breeds out there, staying in puppy mode well into year three. They're not trying to be difficult. They just throw themselves at everything with total enthusiasm and zero filter. Channel that energy into training and exercise and you've got an incredible dog. Try to fight it and you'll both end up frustrated.",
    trainingTips: [
      'Plan for a very long puppyhood. Irish Setters mature slowly, so build patience into your expectations through extended adolescence.',
      'Burn energy before training. An Irish Setter with a full tank is physically incapable of paying attention.',
      'Keep sessions upbeat and varied. Repetitive drills bore them fast and you will lose them.',
    ],
    commonChallenges: ['hyperactivity', 'jumping', 'slow_maturity', 'distractibility', 'counter_surfing'],
    exerciseNeeds: '90+ minutes daily — running, field work, swimming',
    lifespan: '12–15 years',
    weight: '60–70 lbs',
  },

  {
    id: 'italian_greyhound',
    name: 'Italian Greyhound',
    group: 'toy',
    size: 'small',
    energy: 'moderate',
    trainability: 'moderate',
    breedInsight: "Elegant on the outside, total goofball on the inside. Italian Greyhounds bond fiercely to their people and carry a private silliness that their dignified appearance completely hides. Fair warning: potty training is their legendary weakness. Many IG owners never hit full reliability, and cold or wet weather makes it dramatically worse. Keep an indoor grass pad around permanently. That's not admitting defeat. That's just being realistic.",
    trainingTips: [
      'Potty training will genuinely test your patience. Treat indoor grass pads as a permanent backup, especially in cold or wet weather.',
      'Protect them from the cold. IGs have almost no body fat and genuinely suffer in temperatures below 50 degrees.',
      'Build confidence through gentle, gradual exposure. Without careful socialization, IGs become fearful and difficult to manage.',
    ],
    commonChallenges: ['potty_training', 'fearfulness', 'cold_sensitivity', 'fragility'],
    exerciseNeeds: '30–45 minutes daily — short walks, indoor play, sprints in safe areas',
    lifespan: '14–15 years',
    weight: '7–14 lbs',
  },

  {
    id: 'jack_russell_terrier',
    name: 'Jack Russell Terrier',
    group: 'terrier',
    size: 'small',
    energy: 'very_high',
    trainability: 'moderate',
    breedInsight: "Small dog, enormous energy, even bigger attitude. Jack Russells are smart, fearless, and relentlessly active. A lot of people get one expecting a cute lap dog and quickly realize they've adopted a tiny tornado. Keep training fast-paced, varied, and genuinely challenging. Bore a JRT and they'll create their own entertainment. It usually involves digging, barking, or destroying something you cared about.",
    trainingTips: [
      'Exercise thoroughly before expecting any focus. JRTs need more activity than most large breeds just to settle down.',
      'Keep training fast-paced and varied. They learn quickly and lose interest even faster.',
      'Manage prey drive strictly. JRTs will chase and kill small animals. Keep them leashed around wildlife.',
    ],
    commonChallenges: ['hyperactivity', 'prey_drive', 'barking', 'digging', 'escape_artist', 'aggression_toward_other_dogs'],
    exerciseNeeds: '90+ minutes daily — running, fetch, agility, earth dog activities',
    lifespan: '13–16 years',
    weight: '13–17 lbs',
  },

  {
    id: 'keeshond',
    name: 'Keeshond',
    group: 'non-sporting',
    size: 'medium',
    energy: 'moderate',
    trainability: 'eager',
    breedInsight: "Keeshonds are affectionate, outgoing dogs with a genuine talent for reading human emotions. They're excellent family dogs and train well with positive methods. Their main challenges are barking (natural alert watchdogs) and a strong pull toward being near their people at all times.",
    trainingTips: [
      'Use their sensitivity to your advantage. Enthusiastic praise is incredibly motivating for this breed.',
      'Manage barking early with a solid quiet cue. Keeshonds bark to alert and it escalates fast without intervention.',
      'Keep them cool during training. Their thick coat makes them heat-sensitive.',
    ],
    commonChallenges: ['barking', 'separation_anxiety', 'heat_sensitivity'],
    exerciseNeeds: '45–60 minutes daily — walks, play, training games',
    lifespan: '12–15 years',
    weight: '35–45 lbs',
  },

  {
    id: 'labradoodle',
    name: 'Labradoodle',
    group: 'mixed',
    size: 'large',
    energy: 'high',
    trainability: 'eager',
    breedInsight: "Labradoodles blend the Lab's eagerness with the Poodle's intelligence. Generally great training partners, but temperament varies a lot by generation and individual. Some are calm and focused (Poodle-leaning), others are bouncy and mouthy (Lab-leaning). Observe your specific dog's tendencies and adjust your approach rather than following a single playbook.",
    trainingTips: [
      'Treat grooming as essential training. Many Labradoodles need professional grooming every 6-8 weeks, so make handling comfortable early.',
      'Channel their intelligence with mental enrichment. A bored Labradoodle becomes a destructive one.',
      'Practice calm greetings consistently. Their friendliness often comes out as jumping.',
    ],
    commonChallenges: ['jumping', 'mouthing', 'overexcitement', 'grooming_resistance'],
    exerciseNeeds: '60–90 minutes daily — walking, swimming, fetch, training',
    lifespan: '12–14 years',
    weight: '50–65 lbs (standard)',
  },

  {
    id: 'labrador_retriever',
    name: 'Labrador Retriever',
    group: 'sporting',
    size: 'large',
    energy: 'high',
    trainability: 'eager',
    breedInsight: "Labs are the most popular breed in the world for good reason. Friendly, trainable, adaptable. But that popularity means a lot of people underestimate how much exercise and training they actually need. These are sporting dogs with real energy and drive. Without structure, they eat everything in sight, jump on everyone, and pull like freight trains on leash. Give them a job and consistent training and they're absolutely incredible.",
    trainingTips: [
      'Manage their mouth. Labs are oral dogs who chew, mouth, and eat everything. Provide appropriate chew toys and teach leave it early.',
      'Use food and retrieval as rewards. Labs are highly motivated by both.',
      'Exercise before training. Labs focus dramatically better after burning off energy.',
      'Watch their weight. Labs gain easily and obesity shortens their already-not-long lifespan.',
    ],
    commonChallenges: ['mouthing', 'jumping', 'counter_surfing', 'pulling', 'eating_everything', 'overexcitement'],
    exerciseNeeds: '60–90 minutes daily — running, swimming, fetch, training',
    lifespan: '10–12 years',
    weight: '55–80 lbs',
  },

  {
    id: 'lagotto_romagnolo',
    name: 'Lagotto Romagnolo',
    group: 'sporting',
    size: 'medium',
    energy: 'moderate',
    trainability: 'eager',
    breedInsight: "Italian water dogs famous for truffle hunting, and that nose-focus is real. Lagottos are intelligent, eager, and genuinely love using their scenting ability. They train well with positive methods and are generally happy, stable dogs. Their curly coat needs regular grooming. Channel their natural scent drive into nosework and you'll have one of the most genuinely satisfied dogs you've ever seen.",
    trainingTips: [
      'Use nosework and scent games. Lagottos are natural scent detectors and this kind of work provides deep mental satisfaction.',
      'Keep grooming positive from puppyhood. Their coat requires regular attention and they need to be comfortable with it.',
      'Provide enough mental stimulation. Smart dogs who need real engagement beyond daily walks.',
    ],
    commonChallenges: ['barking', 'digging', 'grooming_needs'],
    exerciseNeeds: '45–60 minutes daily — walks, scent work, swimming',
    lifespan: '15–17 years',
    weight: '24–35 lbs',
  },

  {
    id: 'leonberger',
    name: 'Leonberger',
    group: 'working',
    size: 'giant',
    energy: 'moderate',
    trainability: 'eager',
    breedInsight: "Gentle, patient giants who love their families deeply. Leonbergers are more trainable than many giant breeds and genuinely enjoy the process. Their size makes early training non-negotiable. A 150-pound dog who jumps or pulls is a serious safety concern, not just a nuisance. Wonderful with children and reliably calm family dogs when properly raised.",
    trainingTips: [
      'Start all training before 4 months. Leo puppies grow incredibly fast and good habits must be set early.',
      'Use their desire to please. Leos are genuinely motivated by making their handler happy.',
      'Skip rough play. Teaching a giant dog that rough physical interaction is fun creates serious problems down the road.',
    ],
    commonChallenges: ['jumping', 'pulling', 'drooling', 'slow_maturity'],
    exerciseNeeds: '45–60 minutes daily — moderate walks, swimming, avoid extreme heat',
    lifespan: '7 years',
    weight: '100–170 lbs',
  },

  {
    id: 'lhasa_apso',
    name: 'Lhasa Apso',
    group: 'non-sporting',
    size: 'small',
    energy: 'moderate',
    trainability: 'independent',
    breedInsight: "Lhasa Apsos were bred as sentinel dogs in Tibetan monasteries. Watchful, independent, and serious about their guarding role despite their small size. Loyal to family, but they can be aloof or snappy with strangers without proper socialization. Training has to be consistent and patient. Lhasas don't respond to force, but they'll work for rewards and genuine praise.",
    trainingTips: [
      'Socialize with handling early and often. Lhasas need extensive grooming and must be comfortable being touched everywhere.',
      'Be consistent but never harsh. Lhasas remember negative experiences and will avoid training that felt unpleasant.',
      "Don't baby them. Small dog syndrome is common and entirely preventable when owners set real boundaries.",
    ],
    commonChallenges: ['barking', 'stranger_wariness', 'resource_guarding', 'stubbornness'],
    exerciseNeeds: '30 minutes daily — short walks, indoor play',
    lifespan: '12–15 years',
    weight: '12–18 lbs',
  },

  {
    id: 'maltese',
    name: 'Maltese',
    group: 'toy',
    size: 'small',
    energy: 'moderate',
    trainability: 'moderate',
    breedInsight: "Sweet, gentle companion dogs who live for human attention. Maltese are smarter than most people give them credit for and can learn impressive tricks when training stays positive and fun. The classic Maltese challenges are potty training (small bladder, surprisingly big stubbornness) and separation anxiety. They were literally bred to be on your lap. Getting them comfortable alone takes real work.",
    trainingTips: [
      'Keep an indoor grass pad or pee pad as a permanent option, especially for rainy or cold days. Maltese hate wet grass.',
      'Prevent small dog syndrome. Train and socialize them like any other dog. Carrying them everywhere creates fearful, snappy behavior.',
      'Crate train properly for alone time. Maltese need to learn independence or separation anxiety will keep escalating.',
    ],
    commonChallenges: ['potty_training', 'separation_anxiety', 'barking', 'tearstaining'],
    exerciseNeeds: '20–30 minutes daily — short walks, indoor play',
    lifespan: '12–15 years',
    weight: '4–7 lbs',
  },

  {
    id: 'maltipoo',
    name: 'Maltipoo',
    group: 'mixed',
    size: 'small',
    energy: 'moderate',
    trainability: 'eager',
    breedInsight: "Maltipoos blend the Maltese's sweet companion nature with the Poodle's intelligence. Generally cheerful, trainable little dogs who genuinely love people. The catch is they inherit challenges from both parent breeds. Potty training drags on longer than you'd expect and separation anxiety is the primary behavioral issue to get ahead of.",
    trainingTips: [
      'Be very patient with housetraining. Both parent breeds are notoriously slow to potty train.',
      'Build independence gradually from day one. Maltipoos inherit separation anxiety risk from both sides.',
      'Use their love of attention as a reward. Praise and play can be just as motivating as treats.',
    ],
    commonChallenges: ['potty_training', 'separation_anxiety', 'barking'],
    exerciseNeeds: '20–30 minutes daily — short walks, indoor play, training games',
    lifespan: '10–15 years',
    weight: '5–20 lbs',
  },

  {
    id: 'mastiff',
    name: 'Mastiff (English)',
    group: 'working',
    size: 'giant',
    energy: 'low',
    trainability: 'moderate',
    breedInsight: "Massive, gentle dogs who are surprisingly sensitive behind that intimidating exterior. At 150+ pounds, every behavior habit gets amplified. Jumping becomes dangerous. Pulling becomes unmanageable. Resource guarding becomes genuinely scary. Train early, train consistently, and get all manners locked in while they're still a size you can actually work with.",
    trainingTips: [
      'Socialize early and intensively. A Mastiff who is fearful or aggressive toward strangers is a serious liability at 150+ pounds.',
      'Train leash manners before 6 months. You will not be able to physically control an adult Mastiff who pulls.',
      'Keep training calm and low-key. Mastiffs are overwhelmed by loud, high-energy handlers.',
    ],
    commonChallenges: ['leash_pulling', 'guarding', 'drooling', 'jumping', 'slow_maturity'],
    exerciseNeeds: '30–45 minutes daily — moderate walks, nothing strenuous during growth',
    lifespan: '6–10 years',
    weight: '120–230 lbs',
  },

  {
    id: 'miniature_australian_shepherd',
    name: 'Miniature Australian Shepherd',
    group: 'herding',
    size: 'small',
    energy: 'very_high',
    trainability: 'eager',
    breedInsight: "Australian Shepherds in a smaller package, and they kept every ounce of the drive, intelligence, and energy. Don't let the size fool you. They need just as much mental stimulation as their full-sized counterparts. Brilliant learners who excel at agility, tricks, and obedience, but without adequate outlets they develop anxious or destructive habits fast.",
    trainingTips: [
      "Treat them like a full-sized working dog. Their brain doesn't know they're small.",
      'Redirect herding instincts early. Mini Aussies will nip ankles and attempt to herd children and other pets.',
      'Provide daily mental enrichment. Puzzle feeders, training sessions, and new tricks are essential, not optional.',
    ],
    commonChallenges: ['nipping', 'herding_behavior', 'barking', 'separation_anxiety', 'hyperactivity'],
    exerciseNeeds: '60–90 minutes daily — agility, fetch, training, mental enrichment',
    lifespan: '12–13 years',
    weight: '20–40 lbs',
  },

  {
    id: 'miniature_pinscher',
    name: 'Miniature Pinscher',
    group: 'toy',
    size: 'small',
    energy: 'high',
    trainability: 'stubborn',
    breedInsight: "Fearless, energetic little dogs who genuinely believe they run the world. Min Pins are escape artists, counter-surfers (yes, at their size), and incredibly persistent when they want something. Training needs to be engaging and rewarding. They're smart enough to train but independent enough to refuse if it's not worth their while.",
    trainingTips: [
      'Secure your home seriously. Min Pins escape through impossibly small gaps and clear surprisingly high barriers.',
      "Use high-value treats exclusively. Min Pins won't work for kibble when there's something more interesting going on.",
      "Channel their confidence into trick training. They love performing when they're in the mood.",
    ],
    commonChallenges: ['escape_artist', 'barking', 'resource_guarding', 'stubbornness', 'potty_training'],
    exerciseNeeds: '45 minutes daily — active play, walks, indoor games',
    lifespan: '12–16 years',
    weight: '8–12 lbs',
  },

  {
    id: 'miniature_schnauzer',
    name: 'Miniature Schnauzer',
    group: 'terrier',
    size: 'small',
    energy: 'high',
    trainability: 'eager',
    breedInsight: "Alert, spirited little dogs who make excellent companions and watchdogs. Mini Schnauzers are more trainable than most terrier breeds and genuinely enjoy the training process. Their main challenges are barking (they alert to everything) and a stubbornness that shows up specifically when they've decided a task is beneath their dignity.",
    trainingTips: [
      'Manage barking proactively. Teach a quiet cue early and reward silence. Schnauzers are naturally vocal alert dogs.',
      'Use food strategically. Schnauzers are prone to pancreatitis, so use low-fat treats and account for training calories.',
      'Vary training to keep them interested. They learn fast and get bored quickly with repetition.',
    ],
    commonChallenges: ['barking', 'stubbornness', 'digging', 'prey_drive'],
    exerciseNeeds: '45–60 minutes daily — walks, play, training games',
    lifespan: '12–15 years',
    weight: '11–20 lbs',
  },

  {
    id: 'mixed_breed',
    name: 'Mixed Breed / Mutt',
    group: 'mixed',
    size: 'medium',
    energy: 'moderate',
    trainability: 'moderate',
    breedInsight: "Mixed breed dogs are wonderfully unique. Each one is literally one of a kind. The key to training a mixed breed is observing YOUR dog rather than following a breed playbook. Watch what motivates them (food? toys? praise?), notice when they learn best, and identify their individual challenges. The training principles are universal. Positive reinforcement, consistency, patience. But the approach has to fit your specific dog's personality.",
    trainingTips: [
      "Observe your dog's natural tendencies. A mix with herding breed traits will need different management than one with hound traits.",
      'Try different reward types to find what YOUR dog values most. Mixed breeds vary widely in motivation.',
      "If you know the breed mix, research each breed's common traits and challenges to anticipate what might surface.",
    ],
    commonChallenges: ['varies_by_individual', 'unknown_triggers', 'unpredictable_size_if_puppy'],
    exerciseNeeds: 'Varies — observe your individual dog\'s needs',
    lifespan: '10–15 years (often longer than purebreds)',
    weight: 'Varies',
  },

  {
    id: 'morkie',
    name: 'Morkie (Maltese/Yorkie)',
    group: 'mixed',
    size: 'small',
    energy: 'moderate',
    trainability: 'moderate',
    breedInsight: "Tiny companion dogs that inherit the Yorkie's boldness and the Maltese's sweetness. Morkies are vocal, attached, and can be surprisingly stubborn for their size. Don't let the small package excuse bad behavior. Small dog syndrome is real and entirely preventable with proper training from the start.",
    trainingTips: [
      "Train them like a real dog. Walking, basic commands, and socialization are not optional just because they're small.",
      'Manage barking proactively. Both parent breeds are vocal and it compounds in this mix.',
      'Potty training will test your patience. Stick with it. Consistency wins eventually.',
    ],
    commonChallenges: ['barking', 'potty_training', 'separation_anxiety', 'fear_aggression'],
    exerciseNeeds: '20 minutes daily — short walks, indoor play',
    lifespan: '10–14 years',
    weight: '4–8 lbs',
  },

  {
    id: 'newfoundland',
    name: 'Newfoundland',
    group: 'working',
    size: 'giant',
    energy: 'moderate',
    trainability: 'eager',
    breedInsight: "Gentle, patient giants bred for water rescue. Newfoundlands are sweet-natured, great with kids, and surprisingly trainable for their size. Like all giant breeds, the window for teaching manners is critical. Train everything before they're full-grown, because a 150-pound Newfie who pulls or jumps is unmanageable. They drool, they shed, they take over your entire couch. Their temperament makes it worth it.",
    trainingTips: [
      'Start leash training early. Newfies are strong and grow fast. Pulling becomes dangerous quickly.',
      'Use swimming as exercise and reward. Newfoundlands are natural water dogs and it is genuinely their favorite thing.',
      'Be gentle and patient. Newfies are sensitive souls who respond poorly to harsh corrections.',
    ],
    commonChallenges: ['leash_pulling', 'drooling', 'jumping', 'slow_maturity'],
    exerciseNeeds: '45–60 minutes daily — swimming, moderate walks, avoid overheating',
    lifespan: '9–10 years',
    weight: '100–150 lbs',
  },

  {
    id: 'nova_scotia_duck_tolling_retriever',
    name: 'Nova Scotia Duck Tolling Retriever',
    group: 'sporting',
    size: 'medium',
    energy: 'very_high',
    trainability: 'eager',
    breedInsight: "The smallest retriever breed, but they packed in the biggest engine. Tollers are incredibly smart, driven, and need both mental and physical outlets every single day. They can be reserved with strangers (unusual for retrievers) and have a distinctive high-pitched bark they use when they're excited. Training needs to be varied and challenging. Tollers excel at everything from obedience to agility to scent work.",
    trainingTips: [
      'Vary training constantly. Tollers are too smart for repetitive drills and will check out on you.',
      "Use retrieval and water as rewards. They're passionate retrievers and swimmers.",
      'Socialize with strangers. Unlike Labs and Goldens, Tollers can be standoffish without proper early exposure.',
    ],
    commonChallenges: ['screaming_bark', 'intensity', 'stranger_wariness', 'obsessive_retrieval'],
    exerciseNeeds: '90+ minutes daily — running, swimming, retrieving, mental enrichment',
    lifespan: '12–14 years',
    weight: '35–50 lbs',
  },

  {
    id: 'old_english_sheepdog',
    name: 'Old English Sheepdog',
    group: 'herding',
    size: 'large',
    energy: 'moderate',
    trainability: 'moderate',
    breedInsight: "Big, shaggy, lovable goofballs with real herding instincts underneath the fluff. Old English Sheepdogs are gentle, great with kids, and surprisingly playful. Their coat is a major commitment. Daily brushing is non-negotiable, full stop. Training should be patient and positive. They're sensitive dogs who genuinely want to please, but they move at their own pace.",
    trainingTips: [
      'Make grooming a positive daily routine from puppyhood. There is no shortcut with this coat.',
      'Redirect herding instincts. OES will try to herd children and other pets without an outlet.',
      "Use patient, consistent methods. They're not fast learners but once something sticks, it sticks.",
    ],
    commonChallenges: ['herding_behavior', 'grooming_demands', 'stubbornness', 'barking'],
    exerciseNeeds: '45–60 minutes daily — moderate walks, play, herding games',
    lifespan: '10–12 years',
    weight: '60–100 lbs',
  },

  {
    id: 'papillon',
    name: 'Papillon',
    group: 'toy',
    size: 'small',
    energy: 'high',
    trainability: 'eager',
    breedInsight: "Tiny athletes with enormous brains. Papillons consistently rank among the most intelligent dog breeds and excel at obedience and agility despite weighing under 10 pounds. Don't underestimate them because of their size. They're fast learners who love mental challenges and will genuinely outperform many larger breeds in training.",
    trainingTips: [
      'Challenge them. Papillons are smart enough for advanced obedience, agility, and complex trick chains.',
      "Don't carry them everywhere. Papillons who walk on their own feet develop better confidence and socialization.",
      'Use tiny treats. Their caloric needs are minimal and training calories add up fast in a 5-pound dog.',
    ],
    commonChallenges: ['barking', 'fragility', 'cold_sensitivity', 'overconfidence_with_large_dogs'],
    exerciseNeeds: '30–45 minutes daily — walks, agility, trick training',
    lifespan: '14–16 years',
    weight: '5–10 lbs',
  },

  {
    id: 'pekingese',
    name: 'Pekingese',
    group: 'toy',
    size: 'small',
    energy: 'low',
    trainability: 'stubborn',
    breedInsight: "Pekingese were bred to sit on the laps of Chinese emperors, and they genuinely haven't forgotten it. Dignified, independent, and completely convinced they're in charge. Training a Peke requires making them think everything was their idea. Force gets you nowhere. Short sessions, good rewards, and a lot of patience are the only approach that actually works.",
    trainingTips: [
      'Keep sessions under 5 minutes. Pekingese have zero tolerance for repetitive drills.',
      'Avoid overheating. Their flat face and thick coat make them extremely heat-sensitive.',
      'Handle and groom from day one. Pekingese need regular grooming and some develop aggression around handling without early exposure.',
    ],
    commonChallenges: ['stubbornness', 'resource_guarding', 'barking', 'potty_training', 'overheating'],
    exerciseNeeds: '20 minutes daily — short walks, indoor play, NO heat',
    lifespan: '12–14 years',
    weight: '7–14 lbs',
  },

  {
    id: 'pomeranian',
    name: 'Pomeranian',
    group: 'toy',
    size: 'small',
    energy: 'moderate',
    trainability: 'moderate',
    breedInsight: "Tiny dogs descended from large Arctic sled dogs, and that big-dog attitude hasn't fully shrunk. Pomeranians are alert, vocal, and surprisingly bold. The biggest mistakes owners make are skipping training because they're small and skipping socialization because they can just be picked up. Treat them like a real dog and they'll surprise you with how capable they actually are.",
    trainingTips: [
      'Address barking from day one. Pomeranians bark at everything and it escalates quickly without management.',
      'Socialize on the ground, not in your arms. They need to learn to handle the world on their own feet.',
      'Use positive methods with tiny treats. Poms are food-motivated but their caloric needs are minimal.',
    ],
    commonChallenges: ['barking', 'potty_training', 'fear_aggression', 'resource_guarding'],
    exerciseNeeds: '20–30 minutes daily — short walks, indoor play',
    lifespan: '12–16 years',
    weight: '3–7 lbs',
  },

  {
    id: 'pomsky',
    name: 'Pomsky (Pomeranian/Husky)',
    group: 'mixed',
    size: 'small',
    energy: 'high',
    trainability: 'independent',
    breedInsight: "Pomskies can inherit the Husky's independence and the Pomeranian's stubbornness. That's a genuinely challenging combination. Temperament varies widely in this mix. Some are trainable and sweet, others are vocal, stubborn escape artists. Observe your individual dog's tendencies and don't assume they'll be an easy small dog just because of their size.",
    trainingTips: [
      "Expect potential Husky-level stubbornness in a small body. Don't underestimate them.",
      'Manage barking and howling early. Both parent breeds are vocal and it shows.',
      'Socialize extensively. Both breeds can develop wariness without consistent positive exposure.',
    ],
    commonChallenges: ['barking', 'howling', 'stubbornness', 'escape_behavior', 'independence'],
    exerciseNeeds: '45–60 minutes daily — active walks, play, mental enrichment',
    lifespan: '13–15 years',
    weight: '20–30 lbs',
  },

  {
    id: 'poodle_miniature',
    name: 'Poodle (Miniature)',
    group: 'non-sporting',
    size: 'small',
    energy: 'high',
    trainability: 'eager',
    breedInsight: "Same brain as the Standard, smaller body, slightly bigger anxiety. Mini Poodles are brilliant learners who genuinely love training, but skip socialization and you'll end up with a nervous, reactive dog. Get them out into the world early, give them real mental challenges, and treat them like the capable dogs they are. Do that and they'll blow you away.",
    trainingTips: [
      'Build confidence through exposure, not coddling. Mini Poodles need to meet the world on their own four feet.',
      'Use their intelligence. Scent work, agility, trick chains. They eat it up and need that kind of challenge.',
      'Watch for submissive urination when they get excited or nervous. Keep greetings calm, low-key, and don\'t hover over them.',
    ],
    commonChallenges: ['anxiety', 'barking', 'submissive_urination', 'separation_anxiety'],
    exerciseNeeds: '45–60 minutes daily — walks, training, mental enrichment',
    lifespan: '10–18 years',
    weight: '10–15 lbs',
  },

  {
    id: 'poodle_standard',
    name: 'Poodle (Standard)',
    group: 'non-sporting',
    size: 'large',
    energy: 'high',
    trainability: 'eager',
    breedInsight: "Don't let the fancy haircuts fool you. Standard Poodles were originally bred as water retrievers and they're serious athletes with seriously sharp minds. They excel at obedience, agility, therapy work, scent work, pretty much everything you put in front of them. The flip side: under-stimulate them and you'll get an anxious, neurotic mess. They need a job.",
    trainingTips: [
      'Challenge them with complex commands and trick chains. Poodles get bored with simple stuff fast.',
      'Socialize with different people early. Some Poodles develop a wariness toward strangers if they don\'t meet enough of them young.',
      'Start grooming handling in puppyhood. Professional grooming every 4-6 weeks is non-negotiable, so make sure they enjoy the process.',
    ],
    commonChallenges: ['separation_anxiety', 'nervousness', 'barking', 'grooming_requirements'],
    exerciseNeeds: '60+ minutes daily — running, swimming, training, agility',
    lifespan: '10–18 years',
    weight: '40–70 lbs',
  },

  {
    id: 'portuguese_water_dog',
    name: 'Portuguese Water Dog',
    group: 'working',
    size: 'medium',
    energy: 'high',
    trainability: 'eager',
    breedInsight: "Athletic, smart, and genuinely happy to work alongside you. Portuguese Water Dogs were bred to assist fishermen on the open water, and that work ethic is still very much there. They're quick learners, excellent swimmers, and thrive in active families. Keep them busy and they're fantastic dogs. Let them get bored and they'll invent their own entertainment, usually involving something you value.",
    trainingTips: [
      'Use water as a reward when possible. PWDs love swimming more than almost anything, so access to water is a powerful motivator.',
      'Give them daily mental challenges. They\'re working dogs at heart and need more than a walk around the block.',
      'Start grooming handling early. Their coat needs professional attention every 6-8 weeks, so build positive associations now.',
    ],
    commonChallenges: ['mouthing', 'jumping', 'overexcitement', 'grooming_needs'],
    exerciseNeeds: '60+ minutes daily — swimming, running, training, fetch',
    lifespan: '11–13 years',
    weight: '35–60 lbs',
  },

  {
    id: 'pug',
    name: 'Pug',
    group: 'toy',
    size: 'small',
    energy: 'low',
    trainability: 'moderate',
    breedInsight: "Lovable, food-obsessed little comedians who live for human attention. Pugs are actually more trainable than people expect because that food drive is a massive asset. The real limitations are physical: short sessions only, cool environments always, and respect when they tap out. They'll also get stubborn when they decide they're done for the day. Keep it fun, keep it cool, and lean on their love of treats.",
    trainingTips: [
      'Train in short sessions in cool environments. Pugs overheat fast and their breathing suffers during physical activity.',
      'Leverage their food obsession hard. Pugs will do almost anything for a treat, so use that for everything you want to teach.',
      'Manage weight strictly. Every extra pound puts more stress on their breathing.',
    ],
    commonChallenges: ['overheating', 'stubbornness', 'potty_training', 'weight_management', 'separation_anxiety'],
    exerciseNeeds: '20–30 minutes daily — short walks in cool weather, indoor play',
    lifespan: '13–15 years',
    weight: '14–18 lbs',
  },

  {
    id: 'rat_terrier',
    name: 'Rat Terrier',
    group: 'terrier',
    size: 'small',
    energy: 'high',
    trainability: 'moderate',
    breedInsight: "More trainable than your average terrier, and loyal to boot. Rat Terriers are quick, tenacious, and actually have some genuine eagerness to please, which is rare for the terrier group. That makes positive training surprisingly effective with them. Just accept one thing upfront: off-leash reliability around squirrels, rabbits, or anything that moves is not happening.",
    trainingTips: [
      'Use their prey drive constructively. Flirt poles and chase games let them do what they love in a way you can control.',
      'Practice recall in enclosed areas only. Around small animals, that prey drive overrides everything.',
      'Keep sessions short and varied. Rat Terriers check out fast when things get repetitive.',
    ],
    commonChallenges: ['prey_drive', 'digging', 'barking', 'escape_behavior'],
    exerciseNeeds: '45–60 minutes daily — active play, walks, mental enrichment',
    lifespan: '12–18 years',
    weight: '10–25 lbs',
  },

  {
    id: 'rhodesian_ridgeback',
    name: 'Rhodesian Ridgeback',
    group: 'hound',
    size: 'large',
    energy: 'high',
    trainability: 'independent',
    breedInsight: "Ridgebacks were bred to track lions in Africa. Let that sink in. They're confident, powerful, and deeply independent. They don't have the people-pleasing drive of a retriever or the eager work ethic of a herding dog. They'll cooperate when they respect you and see a clear reason to. Training has to be fair, consistent, and never punitive. Earn their respect and you have a magnificent companion. Try to dominate one and you'll lose every time.",
    trainingTips: [
      'Socialize early and keep it going. Without proper exposure, Ridgebacks default to protective and territorial.',
      'Use their prey drive for training games. Flirt poles and retrieval work give them an outlet and build engagement.',
      'Be calm and confident. Ridgebacks mirror their handler\'s energy. Excitability and frustration get you nowhere.',
    ],
    commonChallenges: ['prey_drive', 'guarding', 'stubbornness', 'counter_surfing', 'leash_pulling'],
    exerciseNeeds: '60–90 minutes daily — running, hiking, lure coursing',
    lifespan: '10–12 years',
    weight: '70–85 lbs',
  },

  {
    id: 'rottweiler',
    name: 'Rottweiler',
    group: 'working',
    size: 'large',
    energy: 'moderate',
    trainability: 'eager',
    breedInsight: "Powerful, confident, and deeply bonded to their family. Despite the tough reputation, Rottweilers are actually eager to please and highly trainable with positive methods. The key is starting early. A well-socialized, well-trained Rottie is one of the most calm, reliable companions you can have. An untrained one is a 100+ pound liability. Training isn't optional with this breed. It's a responsibility.",
    trainingTips: [
      'Socialize intensively from 8 weeks. Rotties need to meet many different people, dogs, and environments during that critical early window.',
      'Set boundaries through positive reinforcement, not intimidation. Rotties respond to fairness, not fear.',
      'Train impulse control as a core skill. Wait, leave it, and stay need to be rock-solid before adolescence hits.',
      'Handle frequently. Touch paws, ears, and the mouth daily so vet visits and grooming are never a battle.',
    ],
    commonChallenges: ['guarding', 'leash_pulling', 'dog_selectivity', 'mouthing', 'jumping'],
    exerciseNeeds: '60+ minutes daily — walks, training, mental enrichment, swimming',
    lifespan: '9–10 years',
    weight: '80–135 lbs',
  },

  {
    id: 'saint_bernard',
    name: 'Saint Bernard',
    group: 'working',
    size: 'giant',
    energy: 'low',
    trainability: 'moderate',
    breedInsight: "Massive and gentle, with a calm temperament that can lull you into a false sense of security. At 140 to 180 pounds, every untrained behavior is a safety issue. They mature slowly and stay goofy and puppyish well into adulthood, so you can't wait for them to calm down. Start training early, focus on the manners that matter most at their size, and be patient with their pace.",
    trainingTips: [
      'Train leash walking, no jumping, and door manners before 6 months. You simply cannot physically manage an untrained adult Saint Bernard.',
      'Keep sessions short and cool. Saints overheat easily and lose focus the moment they get warm.',
      'Use gentle, patient methods. They\'re sensitive dogs and shut down completely with harsh corrections.',
    ],
    commonChallenges: ['leash_pulling', 'jumping', 'drooling', 'overheating', 'slow_maturity'],
    exerciseNeeds: '30–45 minutes daily — moderate walks, avoid heat and strenuous exercise',
    lifespan: '8–10 years',
    weight: '120–180 lbs',
  },

  {
    id: 'samoyed',
    name: 'Samoyed',
    group: 'working',
    size: 'medium',
    energy: 'high',
    trainability: 'moderate',
    breedInsight: "Social, vocal, and perpetually cheerful. The Sammy smile is real and it will get them out of trouble constantly. They're more biddable than most spitz breeds but still have that independent streak. The main challenges are three things: barking (they're naturally vocal and expressive), digging (they're natural excavators), and that gorgeous white coat that requires serious, ongoing commitment to maintain.",
    trainingTips: [
      'Set realistic barking expectations. Samoyeds are vocal communicators and you won\'t eliminate it. Focus on teaching a solid "quiet" cue instead.',
      'Give them a digging outlet. A designated dig box saves your yard and satisfies the instinct at the same time.',
      'Build positive handling habits early. Daily brushing is non-negotiable for Samoyeds, so make sure they enjoy it from the start.',
    ],
    commonChallenges: ['barking', 'digging', 'pulling', 'grooming_requirements', 'heat_sensitivity'],
    exerciseNeeds: '60+ minutes daily — running, pulling activities, play, mental enrichment',
    lifespan: '12–14 years',
    weight: '35–65 lbs',
  },

  {
    id: 'schnauzer_standard',
    name: 'Schnauzer (Standard)',
    group: 'working',
    size: 'medium',
    energy: 'high',
    trainability: 'eager',
    breedInsight: "Versatile, intelligent, and with enough independence to keep you honest. Standard Schnauzers are more trainable than the terrier-group Schnauzers but they still have opinions, and they'll let you know it. They bond deeply with family and make excellent watchdogs. Sometimes too excellent. Barking needs to be managed early before it becomes the house soundtrack.",
    trainingTips: [
      'Mix up the mental stimulation. Standard Schnauzers get bored fast with repetitive routines.',
      'Socialize with strangers regularly. Their watchdog instinct can become a real problem without positive exposure to new people.',
      'Be firm, fair, and consistent. They\'ll test every rule exactly once to see if you mean it.',
    ],
    commonChallenges: ['barking', 'stubbornness', 'guarding', 'prey_drive'],
    exerciseNeeds: '60+ minutes daily — running, training, agility, mental work',
    lifespan: '13–16 years',
    weight: '30–50 lbs',
  },

  {
    id: 'schnoodle',
    name: 'Schnoodle (Schnauzer/Poodle)',
    group: 'mixed',
    size: 'small',
    energy: 'high',
    trainability: 'eager',
    breedInsight: "You get the Schnauzer's alertness and the Poodle's intelligence in one compact package. Schnoodles are smart, active, and generally enjoy training. The thing to watch: the Schnauzer side brings a strong watchdog instinct, so barking is almost always the primary challenge you'll be managing.",
    trainingTips: [
      'Get ahead of the alert barking early. Both parent breeds are natural watchdogs, so this needs work from day one.',
      'Feed their brain with puzzle toys and trick training. They genuinely need the mental work.',
      'Socialize with lots of different people. It goes a long way toward tempering that Schnauzer watchdog instinct.',
    ],
    commonChallenges: ['barking', 'stubbornness', 'grooming_needs'],
    exerciseNeeds: '45 minutes daily — walks, play, training games',
    lifespan: '12–15 years',
    weight: '10–20 lbs (miniature)',
  },

  {
    id: 'shar_pei',
    name: 'Shar-Pei',
    group: 'non-sporting',
    size: 'medium',
    energy: 'low',
    trainability: 'independent',
    breedInsight: "Calm, dignified, and deeply loyal to family. Shar-Peis are naturally suspicious of strangers and that's just who they are. They need confident, consistent training from an experienced owner. Early socialization is absolutely critical here. An unsocialized Shar-Pei can become seriously aggressive. They're intelligent but always decide for themselves whether your request is worth following.",
    trainingTips: [
      'Socialize intensively and early. Without deliberate positive exposure, Shar-Peis default to suspicion toward everyone.',
      'Handle daily. Touch paws, ears, and those wrinkles. Regular wrinkle cleaning and vet care are ongoing needs.',
      'Use patient, positive methods. Harsh handling makes Shar-Peis either shut down completely or get confrontational.',
    ],
    commonChallenges: ['stranger_aggression', 'dog_aggression', 'stubbornness', 'handling_sensitivity'],
    exerciseNeeds: '30–45 minutes daily — moderate walks, avoid heat',
    lifespan: '8–12 years',
    weight: '45–60 lbs',
  },

  {
    id: 'shetland_sheepdog',
    name: 'Shetland Sheepdog',
    group: 'herding',
    size: 'small',
    energy: 'high',
    trainability: 'eager',
    breedInsight: "Brilliantly trainable herding dogs who live for connection with their person. Shelties excel at obedience, agility, and tricks and genuinely enjoy the work. They're sensitive and responsive. Train with too heavy a hand and you'll crush them. The main challenges are barking, because Shelties are among the most vocal breeds out there, and a natural shyness that needs careful socialization. Get that right and they'll absolutely amaze you.",
    trainingTips: [
      'Address barking early. Shelties bark at everything and it escalates fast. Teach "quiet" as a foundation command, not an afterthought.',
      'Use their sensitivity as a training asset. Soft praise and gentle encouragement often work better than any treat.',
      'Socialize with confidence-building in mind. Many Shelties are naturally reserved with strangers and need gentle, positive exposure.',
    ],
    commonChallenges: ['barking', 'shyness', 'herding_behavior', 'noise_sensitivity'],
    exerciseNeeds: '45–60 minutes daily — agility, fetch, training, walks',
    lifespan: '12–14 years',
    weight: '15–25 lbs',
  },

  {
    id: 'shiba_inu',
    name: 'Shiba Inu',
    group: 'non-sporting',
    size: 'small',
    energy: 'moderate',
    trainability: 'independent',
    breedInsight: "The most cat-like of all dog breeds. Independent, clean, and very selective about when they choose to engage. They're intelligent, but training is always on their terms. The famous Shiba scream will absolutely make an appearance when they're unhappy with a situation. Training a Shiba requires creativity, patience, and genuine acceptance that they'll never be a Golden Retriever. Respect who they are and they're loyal, endlessly entertaining companions.",
    trainingTips: [
      'Make every command worth their while. Shibas are always asking what\'s in it for them, so have a genuinely good answer ready.',
      'Never chase a loose Shiba. They treat it like a game and can run for hours. Use emergency recall protocols instead.',
      'Address resource guarding early. Shibas are naturally possessive and it escalates fast without active intervention.',
    ],
    commonChallenges: ['recall', 'resource_guarding', 'stubbornness', 'dog_selectivity', 'escape_artist'],
    exerciseNeeds: '45–60 minutes daily — walks, hiking, mental enrichment',
    lifespan: '13–16 years',
    weight: '17–23 lbs',
  },

  {
    id: 'shih_tzu',
    name: 'Shih Tzu',
    group: 'toy',
    size: 'small',
    energy: 'low',
    trainability: 'moderate',
    breedInsight: "Literally bred to be pampered companions in Chinese palaces. That tells you everything. Shih Tzus are affectionate, adaptable, and perfectly happy spending most of their time close to you. Training works best when it feels like a game rather than a chore. They can be stubborn but treats and praise go a long way. Potty training is the most common struggle: small bladders plus a strong preference for indoor comfort means consistency is everything.",
    trainingTips: [
      'Expect a long potty training process. Shih Tzus are notoriously slow to housetrain, so a strict, consistent schedule is your best friend.',
      'Keep sessions short and fun. A 5-minute session where they\'re actually engaged beats a 15-minute one where they\'ve checked out.',
      'Build grooming habits early. Shih Tzus need daily brushing and regular professional grooming, so make sure they enjoy it.',
    ],
    commonChallenges: ['potty_training', 'stubbornness', 'separation_anxiety', 'grooming_resistance'],
    exerciseNeeds: '20–30 minutes daily — short walks, indoor play',
    lifespan: '10–18 years',
    weight: '9–16 lbs',
  },

  {
    id: 'husky',
    name: 'Siberian Husky',
    group: 'working',
    size: 'medium',
    energy: 'very_high',
    trainability: 'independent',
    breedInsight: "Beautiful, charismatic, and one of the most genuinely challenging breeds to train. Huskies were bred to run for hours in freezing conditions while making completely independent decisions. They don't look to humans for direction the way herding or sporting breeds do. Recall is nearly impossible. Escape artistry is legendary. They'll talk back to every command. Training a Husky means accepting who they are and building creative management systems around that reality.",
    trainingTips: [
      'Never trust a Husky off-leash. Ever. Prey drive plus independence makes reliable recall virtually impossible.',
      'Secure your yard like you mean it. Huskies dig under fences, jump over them, and can figure out gates.',
      'Find what they actually value and use it exclusively for training. Many Huskies are picky eaters, so the right reward matters.',
      'Work with their vocalizations, not against them. Teaching speak and quiet gives you at least some control over the talking.',
    ],
    commonChallenges: ['escape_artist', 'recall', 'prey_drive', 'digging', 'howling', 'stubbornness', 'destruction'],
    exerciseNeeds: '120+ minutes daily — running, pulling sports, hiking, mental enrichment',
    lifespan: '12–14 years',
    weight: '35–60 lbs',
  },

  {
    id: 'soft_coated_wheaten_terrier',
    name: 'Soft Coated Wheaten Terrier',
    group: 'terrier',
    size: 'medium',
    energy: 'high',
    trainability: 'moderate',
    breedInsight: "The friendliest terrier breed, by a comfortable margin. Wheatens greet everyone with the famous Wheaten Greeting: an enthusiastic, full-body bounce that's adorable in a puppy and a real management challenge in a full-grown dog. They're fun, genuinely trainable, and less stubbornly independent than most terriers. The two main things to work on are their overwhelming enthusiasm with people and keeping up with that coat.",
    trainingTips: [
      'Make calm greetings your number one priority. The Wheaten Greeting is charming in theory but a real problem in practice.',
      'Keep training positive and varied. Wheatens respond well but get bored fast with repetitive exercises.',
      'Commit to daily brushing. Their silky coat mats quickly and professional grooming is a regular necessity.',
    ],
    commonChallenges: ['jumping', 'overexcitement', 'pulling', 'prey_drive', 'grooming_needs'],
    exerciseNeeds: '60 minutes daily — active walks, play, training',
    lifespan: '12–14 years',
    weight: '30–40 lbs',
  },

  {
    id: 'staffordshire_bull_terrier',
    name: 'Staffordshire Bull Terrier',
    group: 'terrier',
    size: 'medium',
    energy: 'high',
    trainability: 'eager',
    breedInsight: "Absolute people-lovers. Staffies are affectionate, loyal, and fantastic with children when properly trained. They're also strong, enthusiastic, and often don't realize their own power. Training needs to focus on impulse control and calm behavior. Their enthusiasm is endearing, but combined with that muscular build, untrained behaviors turn into management challenges very quickly.",
    trainingTips: [
      'Lean into their love of people. Praise and physical affection are powerful rewards for Staffies, sometimes more than food.',
      'Teach impulse control early and often. Their enthusiasm is genuinely endearing but it needs clear boundaries.',
      'Socialize with other dogs carefully and consistently. Some Staffies develop dog-selectivity as they move through adolescence.',
    ],
    commonChallenges: ['jumping', 'pulling', 'overexcitement', 'dog_selectivity', 'mouthing'],
    exerciseNeeds: '60+ minutes daily — running, tug, fetch, active play',
    lifespan: '12–14 years',
    weight: '24–38 lbs',
  },

  {
    id: 'toy_poodle',
    name: 'Toy Poodle',
    group: 'toy',
    size: 'small',
    energy: 'moderate',
    trainability: 'eager',
    breedInsight: "All the intelligence of a Standard Poodle in a much smaller package. Toy Poodles are quick learners who genuinely love tricks and obedience work. The trap owners fall into is coddling them, and that's where anxious behaviors develop. Treat them like capable dogs rather than fragile accessories and they'll impress you with both their trainability and their confidence.",
    trainingTips: [
      'Resist the urge to carry them everywhere. Walking on their own four feet builds the confidence and social skills they need.',
      'Actually challenge their intelligence. Toy Poodles are capable of complex training that most owners never bother attempting.',
      'Use consistent routine and positive exposure to new experiences to prevent anxious tendencies from taking hold.',
    ],
    commonChallenges: ['anxiety', 'barking', 'potty_training', 'submissive_urination'],
    exerciseNeeds: '30 minutes daily — walks, trick training, indoor play',
    lifespan: '10–18 years',
    weight: '4–6 lbs',
  },

  {
    id: 'vizsla',
    name: 'Vizsla',
    group: 'sporting',
    size: 'medium',
    energy: 'very_high',
    trainability: 'eager',
    breedInsight: "The velcro dog of the sporting world. Vizslas want to be physically touching you at all times and have the energy to follow you everywhere you go. They're incredibly trainable and sensitive, but their exercise needs are extreme. A Vizsla who doesn't get enough physical and mental stimulation will develop severe anxiety, destructive behavior, and serious separation issues. This is genuinely a breed for active people only.",
    trainingTips: [
      'Exhaust them physically before expecting any training focus. Vizslas need serious exercise. Jogging, not walking.',
      'Skip the harsh corrections entirely. Vizslas are among the most sensitive breeds out there and a raised voice can set training back weeks.',
      'Build separation tolerance gradually from puppyhood. Vizslas are prone to severe separation anxiety and need to learn how to be alone.',
    ],
    commonChallenges: ['separation_anxiety', 'hyperactivity', 'mouthing', 'jumping', 'clinginess'],
    exerciseNeeds: '90–120 minutes daily — running, swimming, field work, vigorous exercise',
    lifespan: '12–14 years',
    weight: '44–60 lbs',
  },

  {
    id: 'weimaraner',
    name: 'Weimaraner',
    group: 'sporting',
    size: 'large',
    energy: 'very_high',
    trainability: 'moderate',
    breedInsight: "Athletic, intelligent, and intensely bonded to their owner. Weimaraners are called the grey ghost for their striking color and their habit of materializing silently everywhere you go, including the bathroom. Like Vizslas, they need extreme amounts of exercise and genuinely struggle when left alone. An active owner with real time and energy gets an incredible dog. A busy, frequently absent owner gets a destructive, anxious mess.",
    trainingTips: [
      'Run them before anything else. Weimaraners need intense physical exercise first. Without it, they can\'t think straight.',
      'Crate train carefully and gradually. Their separation anxiety makes crate training essential, but it has to be done positively or it backfires.',
      'Be consistent and confident. Weimaraners test every boundary and need a handler they actually respect.',
    ],
    commonChallenges: ['separation_anxiety', 'hyperactivity', 'counter_surfing', 'destruction', 'jumping'],
    exerciseNeeds: '90–120 minutes daily — running, hiking, swimming, field work',
    lifespan: '10–13 years',
    weight: '55–90 lbs',
  },

  {
    id: 'west_highland_white_terrier',
    name: 'West Highland White Terrier',
    group: 'terrier',
    size: 'small',
    energy: 'moderate',
    trainability: 'moderate',
    breedInsight: "Confident, cheerful, and very sure of themselves. Westies are more trainable than a lot of terrier breeds, but that independent streak is still very much there. They're fun, portable companions who can do great in apartments, as long as you get the barking under control. Keep training upbeat and positive and you'll end up with a genuinely responsive, entertaining little dog.",
    trainingTips: [
      'Get barking under control early. Westies are alert barkers and it escalates fast, especially in apartment settings.',
      'Use food rewards liberally. Westies are highly food-motivated and that\'s your biggest training asset.',
      'Give the digging somewhere to go. A sandbox or dig box redirects the instinct and saves your garden.',
    ],
    commonChallenges: ['barking', 'digging', 'prey_drive', 'stubbornness'],
    exerciseNeeds: '30–45 minutes daily — walks, play, training games',
    lifespan: '13–15 years',
    weight: '15–20 lbs',
  },

  {
    id: 'whippet',
    name: 'Whippet',
    group: 'hound',
    size: 'medium',
    energy: 'moderate',
    trainability: 'moderate',
    breedInsight: "Gentle, quiet, and surprisingly low-maintenance as house dogs. Also the second-fastest breed alive. Whippets are pure sprinters, not marathoners: a few short bursts of running and they're perfectly content to spend the rest of the day on your couch. Training needs to stay gentle and positive. Whippets are sensitive dogs and harsh methods don't just fail, they shut them down entirely.",
    trainingTips: [
      'Never trust a Whippet off-leash in an open area. Their prey drive fires instantly at the sight of movement.',
      'Keep training soft and positive. Whippets are sensitive and hold onto negative experiences for a long time.',
      'Give them a warm, soft place to sleep. With almost no body fat, Whippets genuinely need a comfortable bed.',
    ],
    commonChallenges: ['prey_drive', 'recall', 'shyness', 'cold_sensitivity'],
    exerciseNeeds: '30–45 minutes daily — short walks, sprints in fenced area',
    lifespan: '12–15 years',
    weight: '25–40 lbs',
  },

  {
    id: 'yorkshire_terrier',
    name: 'Yorkshire Terrier',
    group: 'toy',
    size: 'small',
    energy: 'moderate',
    trainability: 'moderate',
    breedInsight: "Tiny terrier, full-sized attitude. Yorkies are feisty, vocal, and surprisingly bold for a dog that fits in a purse. The biggest mistakes owners make are classic small dog pitfalls: skipping training because they're small, skipping socialization because you can just carry them, and ignoring barking because it seems harmless. Train a Yorkie like the real dog they are and you'll have a confident, well-mannered companion.",
    trainingTips: [
      'Give potty training extra time and patience. Small bladder plus stubborn nature equals a long process. Strict schedule plus an indoor backup option is your best setup.',
      'Walk them on the ground. Yorkies that get carried everywhere tend to develop fear aggression and poor social skills.',
      'Stay on top of barking from day one. "Quiet" should be one of the very first things you teach.',
    ],
    commonChallenges: ['barking', 'potty_training', 'fear_aggression', 'resource_guarding', 'separation_anxiety'],
    exerciseNeeds: '20–30 minutes daily — short walks, indoor play',
    lifespan: '11–15 years',
    weight: '4–7 lbs',
  },

  {
    id: 'dont_know',
    name: "I Don't Know / Not Sure",
    group: 'mixed',
    size: 'medium',
    energy: 'moderate',
    trainability: 'moderate',
    breedInsight: "Totally fine. Not knowing your dog's breed is completely normal, especially with rescues and mixed breeds. The good news: the core training principles work for every dog regardless. Positive reinforcement, consistency, patience, building trust. We'll focus on your dog's individual behavior and challenges rather than breed assumptions. Watch how your dog responds to different rewards, what excites them, what stresses them out. That tells you more than any breed label ever could.",
    trainingTips: [
      'Focus on your specific dog, not breed stereotypes. Watch what motivates them, whether that\'s food, toys, or praise, and use that.',
      'Try a DNA test if you\'re curious. Embark and Wisdom Panel can identify breed mix and flag health predispositions worth knowing.',
      'Start with the fundamentals. Sit, stay, come, and leash manners are universal. Every dog needs them regardless of breed.',
    ],
    commonChallenges: ['varies_by_individual'],
    exerciseNeeds: 'Observe your dog — adjust based on their energy and needs',
    lifespan: 'Varies',
    weight: 'Varies',
  },

];

// ============================================================
// EXPORT: Alphabetized by name (already ordered above)
// ============================================================
export { BREEDS };
export default BREEDS;

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Find a breed by ID
 */
export function getBreedById(id: string): BreedData | undefined {
  return BREEDS.find(breed => breed.id === id);
}

/**
 * Find a breed by name (case-insensitive partial match)
 */
export function searchBreedByName(name: string): BreedData[] {
  const lower = name.toLowerCase();
  return BREEDS.filter(breed => breed.name.toLowerCase().includes(lower));
}

/**
 * Get all breeds in a specific group
 */
export function getBreedsByGroup(group: BreedGroup): BreedData[] {
  return BREEDS.filter(breed => breed.group === group);
}

/**
 * Get breed names for quiz dropdown (alphabetized)
 */
export function getBreedNamesForQuiz(): { id: string; name: string }[] {
  return BREEDS.map(breed => ({ id: breed.id, name: breed.name }));
}

/**
 * Get training tips for a specific breed
 * Falls back to general tips if breed not found
 */
export function getTrainingTipsForBreed(breedId: string): string[] {
  const breed = getBreedById(breedId);
  if (breed) return breed.trainingTips;
  
  // Fallback general tips
  return [
    'Use positive reinforcement. Reward behaviors you want to see more of.',
    'Keep training sessions short (5-10 minutes) and end on a positive note.',
    'Be consistent with commands and expectations across all family members.',
  ];
}

/**
 * Get the quiz results insight paragraph for a breed
 * This is the personalized text shown on the quiz results screen
 */
export function getBreedInsight(breedId: string, dogName?: string): string {
  const breed = getBreedById(breedId);
  if (!breed) {
    return dogName
      ? `Every dog is unique, and ${dogName} is no exception. We'll build a training plan based on ${dogName}'s specific behaviors and challenges rather than breed assumptions. The fundamentals of positive reinforcement and consistency work for every dog.`
      : 'Every dog is unique. We\'ll build a training plan based on specific behaviors and challenges rather than breed assumptions. The fundamentals of positive reinforcement and consistency work for every dog.';
  }
  return breed.breedInsight;
}
