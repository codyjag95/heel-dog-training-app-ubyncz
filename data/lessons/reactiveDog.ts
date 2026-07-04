/**
 * Reactive Dog Category
 * 10 lessons: 1 free intro, 9 premium
 * PLACEMENT: data/lessons/reactiveDog.ts
 */

import { Lesson } from '../categoryData';

export const REACTIVE_DOG_LESSONS: Lesson[] = [
  // ── FREE INTRO ──
  {
    id: 'rd_1',
    title: 'Understanding Reactivity',
    description: 'What\'s actually happening when your dog loses it, and why punishment makes it worse.',
    duration: 10,
    difficulty: 1,
    isPremium: false,
    steps: [
      'Reactivity is not aggression. A reactive dog is a dog who overreacts to certain triggers (other dogs, people, bikes, skateboards, cars). The reaction is usually barking, lunging, growling, or spinning. It looks scary, but in most cases the dog is scared or frustrated, not dangerous.',
      'There are two main types of reactivity. Fear-based: "that thing scares me, stay away!" The dog is trying to create distance. Frustration-based: "I WANT to get to that thing and I can\'t!" The dog is overstimulated and the leash is preventing them from doing what they want.',
      'Both types look the same from the outside (barking, lunging) but they have different causes and slightly different treatment approaches. Fear-based reactivity requires building confidence. Frustration-based reactivity requires impulse control training.',
      'Why does punishment make it worse? When your dog sees another dog and you yank the leash, yell "NO," or use a shock collar, here\'s what your dog learns: "Every time I see another dog, something painful happens." Now they associate other dogs with pain. The underlying emotion gets worse, not better.',
      'The good news: reactivity is one of the most treatable behavior issues in dogs. It requires patience, consistency, and the right approach, but most reactive dogs can learn to walk calmly past their triggers. Not overnight, but reliably.',
      'The foundation of all reactivity work is one concept: threshold. This is the distance at which your dog notices a trigger but can still think clearly. Below threshold, your dog can learn. Over threshold, they\'re just reacting on autopilot. Everything in this category builds on finding and working at your dog\'s threshold.'
    ],
    tips: [
      'Your dog is not doing this to embarrass you or be difficult. They\'re having a genuine emotional response that they don\'t know how to control. Approaching it with empathy instead of frustration changes everything.',
      'Reactivity is more common than most people think. You are not alone. Walk through any neighborhood and count the dogs barking behind fences and lunging on leashes. It\'s everywhere.',
      'Management is not failure. Using tools like distance, timing your walks to avoid triggers, and crossing the street before your dog reacts are all smart strategies while you work on the underlying behavior.',
      'If your dog\'s reactivity includes actual bite history (breaking skin, not just air snapping), work with a certified veterinary behaviorist, not just a trainer. This level requires professional assessment.'
    ]
  },

  // ── PREMIUM LESSONS ──
  {
    id: 'rd_2',
    title: 'Finding Your Dog\'s Threshold',
    description: 'How to identify exactly where your dog can learn vs where they shut down.',
    duration: 10,
    difficulty: 2,
    isPremium: true,
    steps: [
      'Your dog\'s threshold is not a fixed distance. It changes based on the trigger (a calm dog vs a barking dog), the environment (quiet street vs busy park), your dog\'s state (rested vs tired, hungry vs full), and even the time of day. But you need a starting baseline.',
      'Find a location where you can see dogs at a distance. A park bench near a walking path works well. Bring your dog and incredibly high-value treats (real meat, not kibble). Sit and observe.',
      'When your dog notices another dog, watch their body. Alert ears and a head turn is "noticing." Hard stare, stiff body, forward lean, or closed mouth is "approaching threshold." Barking and lunging is "over threshold." You need to work at "noticing" distance.',
      'Measure that distance roughly. Is it 50 feet? 30 feet? 100 feet? This is your starting line. All future training happens at this distance or further until your dog is consistently calm there.',
      'Here\'s the crucial part: your dog should still be able to take treats at working distance. If they won\'t eat, they\'re too close. Food refusal is one of the most reliable indicators that a dog is over threshold.',
      'Record your threshold distances in a note on your phone. Track: trigger type, distance, reaction level (1-10), whether they could take treats. Over weeks, you\'ll see the distances shrink. That\'s progress.'
    ],
    tips: [
      'Threshold is like a bank account. A good night\'s sleep, a calm morning, and a walk before training deposits energy your dog can spend on staying calm. A stressful car ride, skipped meal, and encountering a trigger on the way to training drains the account before you start.',
      'Some dogs have different thresholds for different triggers. They might be fine with small dogs at 10 feet but need 50 feet from large dogs. Track each trigger separately.',
      'The time of day matters more than people realize. Many dogs are more reactive in the evening when cortisol levels are naturally higher. Try morning sessions first.',
      'Wind direction affects threshold too. If your dog can smell the other dog before they see them, their arousal starts building earlier. Note wind conditions in your tracking.'
    ]
  },
  {
    id: 'rd_3',
    title: 'Counter-Conditioning Protocol',
    description: 'The core technique that changes how your dog FEELS about triggers.',
    duration: 15,
    difficulty: 3,
    isPremium: true,
    steps: [
      'Counter-conditioning (CC) is not teaching your dog to behave differently. It\'s changing their emotional response to the trigger. Right now, seeing another dog makes your dog feel fear or frustration. After CC, seeing another dog makes them feel anticipation for a reward. Different emotion, different behavior.',
      'The protocol is simple. Dog notices trigger at or below threshold. You immediately start feeding high-value treats, one after another, in rapid succession. Trigger disappears (walks away, goes behind a tree). Treats stop. Trigger appears again. Treats start again.',
      'The timing is critical. The treats must START when the trigger appears and STOP when the trigger disappears. Your dog is learning: "that thing predicts steak." If you give treats randomly, the association doesn\'t form.',
      'Do not ask for any behaviors. Don\'t say sit, don\'t say watch me, don\'t say leave it. Just feed. Your dog can do literally anything except go over threshold. Standing, sitting, lying down, sniffing the ground, looking at you, looking at the trigger. All fine. You\'re working on emotions, not obedience.',
      'Session length: 5-10 minutes maximum. End while things are going well. Three successful sessions per week is better than daily sessions where you push too hard.',
      'You\'ll know it\'s working when your dog sees the trigger and immediately looks at you with a "where\'s my treat?" expression instead of stiffening up. This is called a "conditioned emotional response" (CER) and it\'s the goal. When you see this consistently at your current distance, decrease distance by 5 feet and start again.'
    ],
    tips: [
      'Use treats your dog would commit crimes for. Boiled chicken, hot dogs, freeze-dried liver, cheese. This is not the time for their regular kibble. The treat value must outweigh the emotional pull of the trigger.',
      'If your dog won\'t take treats, you\'re too close to the trigger. Move further away. Not taking food means they\'re over threshold and can\'t learn.',
      'Don\'t practice CC during random walks. Set up dedicated training sessions at specific locations where you can control the distance. Random encounters are management situations, not training opportunities.',
      'This process typically takes 6-12 weeks of consistent practice for moderate reactivity. Severe cases may take longer. There are no shortcuts, but the results are lasting.'
    ]
  },
  {
    id: 'rd_4',
    title: 'The Emergency U-Turn',
    description: 'Your escape plan for unexpected trigger encounters on walks.',
    duration: 8,
    difficulty: 2,
    isPremium: true,
    steps: [
      'No matter how carefully you plan, you will encounter triggers unexpectedly. A dog rounds a corner 10 feet away. A jogger appears behind you. Someone\'s off-leash dog charges toward you. The Emergency U-Turn is your go-to management tool for these situations.',
      'Practice without triggers first. On a normal walk, say "let\'s go!" in an upbeat tone, turn 180 degrees, and walk briskly in the opposite direction. The moment your dog turns with you, mark ("yes!") and treat. Practice this 20-30 times until the response is automatic.',
      'The tone matters. "Let\'s go!" should sound exciting and fun, not panicked or angry. You\'re inviting your dog on an adventure, not dragging them away from something scary. Your energy sets the tone for their response.',
      'Practice with low-level distractions first. Turn away from a squirrel, a blowing leaf, a person at a distance. Build the muscle memory before you need it in a high-pressure situation.',
      'When you see a real trigger approaching and you know your dog can\'t handle the distance, execute the U-turn before your dog goes over threshold. The key word is BEFORE. If they\'re already barking and lunging, the U-turn is damage control, not training.',
      'After a U-turn, walk your dog to a calm distance and let them decompress. Then continue your walk normally. Don\'t go home immediately unless your dog is truly rattled. The message should be "we handled that, no big deal, walk continues" not "scary thing happened, everything is ruined."'
    ],
    tips: [
      'Some people feel embarrassed doing a U-turn. Get over it. The person with the other dog doesn\'t care. And even if they judge you, your dog\'s emotional wellbeing matters more than a stranger\'s opinion.',
      'If a U-turn isn\'t possible (narrow sidewalk, fenced path), step off the path as far as you can, put your body between your dog and the trigger, and feed treats rapidly until the trigger passes.',
      'Practice your U-turn timing by watching dog-walking videos and saying "let\'s go!" the moment you spot a dog on screen. Building your own observation and reaction speed matters just as much as training your dog.',
      'Always scan ahead on walks. The earlier you spot a potential trigger, the more options you have. Walking with your phone out looking down is a reactivity management nightmare.'
    ]
  },
  {
    id: 'rd_5',
    title: 'Leash Reactivity Management',
    description: 'Why your dog is worse on leash and how to manage walks while you train.',
    duration: 12,
    difficulty: 3,
    isPremium: true,
    steps: [
      'Most reactive dogs are significantly worse on leash than off leash. This isn\'t a coincidence. The leash prevents your dog from doing what their instincts tell them to do: either approach (frustration) or flee (fear). When both options are removed, the only remaining option is to make the trigger go away through noise and intimidation.',
      'Leash tension makes it worse. When you tighten the leash (which is everyone\'s instinct when they see a trigger), your dog feels the restriction, their stress increases, and they associate that tension with the presence of the trigger. Loose leash skills are prerequisite to reactivity work.',
      'Walk timing strategy: learn when your neighborhood is quiet and when it\'s busy. Walk during quiet windows for training sessions. Walk during moderate windows for maintenance. Avoid peak times until your dog is ready.',
      'Route planning: before you leave the house, know your route, your escape routes, and where triggers are likely to appear. Have at least two alternate paths at every point on your walk. This isn\'t paranoia. This is responsible management.',
      'Equipment matters. A front-clip harness gives you more steering control without putting pressure on the neck (which increases arousal). A 6-foot standard leash gives you the right balance of control and freedom. Never use a retractable leash with a reactive dog.',
      'Walk decompression: after any trigger encounter on a walk, give your dog 5 minutes of sniffing time in a calm area. Sniffing is a natural calming behavior. It lowers heart rate and stress hormones. Let them sniff as long as they want.'
    ],
    tips: [
      'Your breathing affects your dog. When you see a trigger and hold your breath or tense up, your dog reads that as a threat signal. Practice breathing slowly and deliberately when you spot a trigger. It sounds silly but it genuinely helps.',
      'Don\'t walk the same route every day. Predictability means your dog starts anticipating triggers at specific locations. They\'ll start getting tense before they even see anything because they "know" a dog lives behind that fence on the left.',
      'If your neighborhood is a minefield of triggers, drive to a quieter location for training walks. The car ride is worth it for the quality of the session.',
      'Walk speed matters. Moving at a brisk, purposeful pace reduces reactivity compared to slow meandering. Slow walking gives your dog too much time to fixate on triggers.'
    ]
  },
  {
    id: 'rd_6',
    title: 'BAT: Behavior Adjustment Training',
    description: 'An advanced protocol that lets your dog make good choices around triggers.',
    duration: 15,
    difficulty: 4,
    isPremium: true,
    steps: [
      'BAT (developed by Grisha Stewart) is different from counter-conditioning. Instead of flooding your dog with treats when they see a trigger, BAT gives your dog the freedom to investigate and choose to disengage on their own. The reinforcement is environmental: the reward for calm behavior is the freedom to move.',
      'Setup: you need a helper with a calm, neutral dog (the decoy). Use a long line (15-30 feet) and a large open space. The decoy stays stationary at a distance well below your dog\'s threshold.',
      'Let your dog move freely on the long line. They\'ll likely notice the decoy and orient toward it. Wait. Don\'t say anything, don\'t lure with treats, don\'t redirect. Give your dog time to process.',
      'Watch for "cut-off signals": your dog will eventually break their focus on the decoy. They might sniff the ground, turn their head, look at you, shake off, or turn their body away. The INSTANT you see any of these signals, calmly say "yes" and walk with your dog in any direction they choose.',
      'Over time, your dog learns: "When I see a trigger and choose to disengage, I get to keep doing what I want." The disengagement becomes self-reinforcing. They\'re choosing calm behavior because it works for them, not because you bribed them.',
      'BAT sessions should be 15-20 minutes max. End on a successful disengagement. If your dog can\'t disengage after 30 seconds of staring, you\'re too close. Increase distance and try again.'
    ],
    tips: [
      'BAT requires patience and good observation skills from the handler. You need to spot subtle disengagement signals (a slight head turn, a weight shift, a quick ground sniff) and mark them instantly.',
      'This protocol works best for dogs who are past the initial counter-conditioning phase and need to build real-world decision-making skills.',
      'The decoy dog must be calm and neutral. A reactive, barking, or lunging decoy defeats the entire purpose. If you don\'t have access to a neutral dog, find a trainer who runs BAT setups.',
      'Read Grisha Stewart\'s "BAT 2.0" book for the full protocol. This lesson covers the basics but the book goes into much more depth on variations and troubleshooting.'
    ]
  },
  {
    id: 'rd_7',
    title: 'Dog-to-Dog Reactivity',
    description: 'Specific strategies for dogs who react to other dogs on walks.',
    duration: 12,
    difficulty: 3,
    isPremium: true,
    steps: [
      'Dog-to-dog reactivity is the most common form. Before you start training, understand your dog\'s specific trigger profile. Do they react to all dogs, or just certain sizes, colors, or energy levels? Do they react more to dogs approaching head-on, or dogs moving parallel? Does the other dog\'s behavior (barking, pulling, staring) matter?',
      'Set up a "trigger hierarchy." Rank triggers from easiest to hardest. Example: (1) small, calm dog at 50 feet, (2) medium dog walking parallel at 30 feet, (3) large dog approaching at 20 feet, (4) barking dog behind a fence. Always train at the level your dog can handle.',
      'Use the "engage-disengage" game. Stage 1 (engage): dog looks at trigger, you mark and treat. The dog learns that looking at triggers predicts treats. Stage 2 (disengage): dog looks at trigger, then looks back at you on their own, you mark and treat. The dog learns that breaking focus pays off.',
      'Practice "pattern games" developed by Leslie McDevitt. The simplest one: walk 5 steps, treat. Walk 5 steps, treat. Walk 5 steps, treat. The predictable pattern gives your dog something to focus on and creates a rhythm that overrides the trigger fixation.',
      'For dogs who are reactive specifically on the return home (they get worse as they approach their territory): practice the last 100 yards of your walk as a separate training session. Walk to a spot 100 yards from home, do focus work, and walk home calmly. Repeat until that stretch is easy.',
      'Never force a greeting. Even if your dog is making progress, they don\'t need to meet every dog they pass. Passing calmly at 6 feet IS the goal. Close interaction is a bonus, not a requirement.'
    ],
    tips: [
      'Dogs behind fences are some of the hardest triggers because the fence creates barrier frustration on both sides. Walk on the opposite side of the street from fenced dogs until your dog is ready for closer exposure.',
      'If another off-leash dog runs toward you, step in front of your dog, make yourself big, point at the approaching dog and say "GO HOME" in a firm voice. Carry citronella spray as a last resort. You are your dog\'s bodyguard.',
      'Male dogs tend to be more reactive to other male dogs. Intact males are more reactive than neutered males in most studies. This doesn\'t mean you must neuter, but it\'s useful context.',
      'Some dogs are fine with dogs they know but reactive to strangers. This is selective reactivity and it\'s actually easier to work with because the dog already has positive dog-to-dog social skills.'
    ]
  },
  {
    id: 'rd_8',
    title: 'People Reactivity',
    description: 'When your dog reacts to humans on walks: strangers, children, or specific types.',
    duration: 12,
    difficulty: 3,
    isPremium: true,
    steps: [
      'People reactivity is often scarier for owners than dog reactivity because the liability risk is higher. A dog who barks and lunges at people on walks is a serious issue that needs professional-level attention. This lesson covers the training, but if biting is involved, consult a veterinary behaviorist.',
      'Identify the trigger profile. Does your dog react to all strangers, or specific types? Men vs women? People wearing hats, carrying bags, using mobility aids? People who approach directly vs people who are just walking by? People who stare or make eye contact? The more specific your profile, the more targeted your training.',
      'Use counter-conditioning at distance. Person appears at below-threshold distance. Treats rain from the sky. Person disappears. Treats stop. Repeat 50-100 times over multiple sessions until your dog sees a person and looks at you expectantly.',
      'Add a "buffer behavior." Teach your dog to sit and look at you when a person approaches. This gives them a job to do instead of reacting. The sit creates a default behavior that replaces the lunging. Practice without triggers first until it\'s automatic.',
      'For dogs who are fine with people at a distance but react when approached: teach people how to greet your dog (or don\'t let them greet at all). Curved approach, no eye contact, no reaching over the head, let the dog come to them. Most people do every single one of these wrong.',
      'For delivery drivers, mail carriers, and other regular triggers: leave treats outside for them to toss toward your dog (through a fence or window). Over time, the delivery person becomes the treat person. This specific counter-conditioning is incredibly effective for territorial reactivity.'
    ],
    tips: [
      'A yellow ribbon on your dog\'s leash or a "NERVOUS" vest communicates to observant people that your dog needs space. Not everyone will notice, but some will, and it gives you an opening to explain.',
      'Practice your verbal script. "Sorry, my dog is in training and needs space." "Please don\'t approach, we\'re working on building confidence." Having the words ready means you won\'t freeze in the moment.',
      'Children running, screaming, and waving their arms are extremely triggering for many dogs. This is often misread as "the dog doesn\'t like kids" when really the dog can\'t handle the chaos. Practice with calm kids first.',
      'If your dog is reactive to specific body types, clothing, or racial characteristics, this is almost always a socialization gap, not anything more complicated. They simply weren\'t exposed to enough variety during their critical period. Counter-conditioning fills the gap.'
    ]
  },
  {
    id: 'rd_9',
    title: 'Building Confidence in Reactive Dogs',
    description: 'Reduce reactivity by building your dog\'s overall confidence and resilience.',
    duration: 10,
    difficulty: 2,
    isPremium: true,
    steps: [
      'Many reactive dogs are fundamentally insecure. They react because the world feels unpredictable and overwhelming. Building their overall confidence reduces reactivity even outside of specific trigger-exposure training.',
      'Nose work is one of the best confidence builders for reactive dogs. Scatter kibble in the grass and let them find it. Hide treats around the house. Play "find it" games in low-stress environments. Sniffing is calming, empowering, and builds problem-solving skills.',
      'Teach "touch" (nose to your hand). This gives your reactive dog a simple, rewarding task they can do anywhere. Feeling capable of performing a skill in different environments builds generalized confidence.',
      'Let your dog make choices. Instead of always directing the walk, sometimes let them choose which direction to go. Let them sniff as long as they want. Let them choose which side of the path to walk on. Autonomy builds confidence. Dogs who feel powerless react more.',
      'Set up problem-solving challenges at home. Put treats in a muffin tin covered with tennis balls. Put a treat under a cup and let them figure out how to get it. Give them cardboard boxes to shred (with treats inside). Success at small challenges transfers to confidence in bigger situations.',
      'Play with your dog. Like really play. Tug, chase, fetch, wrestling (if they enjoy it). Play builds trust, releases tension, and strengthens your bond. A dog who trusts their handler is less reactive because they believe you\'ll keep them safe.'
    ],
    tips: [
      'Don\'t accidentally reinforce learned helplessness. If you always avoid every trigger, carry your dog past everything, and never let them experience mild challenges, they never learn they can cope. Controlled exposure builds resilience.',
      'Decompression walks (long line in a quiet field, free to sniff and explore at their own pace) are therapeutic for reactive dogs. Once a week minimum. Let them just be a dog.',
      'Platform training and place training build confidence through clarity. The dog knows exactly what to do and where to be, which reduces anxiety about uncertainty.',
      'Celebrate tiny wins. A reactive dog who looked at a trigger and then chose to sniff the ground just made a massive decision. That deserves your best treats and genuine excitement.'
    ]
  },
  {
    id: 'rd_10',
    title: 'When to Get Professional Help',
    description: 'How to know when you need a trainer or behaviorist, and how to find a good one.',
    duration: 8,
    difficulty: 1,
    isPremium: true,
    steps: [
      'You should seek professional help if: your dog has bitten someone (breaking skin), the reactivity is getting worse despite your training efforts, you feel unsafe walking your dog, your dog redirects aggression onto you when triggered, or the reactivity is so severe that your dog cannot function on normal walks.',
      'There are different levels of professional help. Group classes are not appropriate for reactive dogs. Look for trainers who offer private sessions and have specific experience with reactivity. Ask them directly: "What is your approach to leash reactivity?" If they mention corrections, dominance, or alpha theory, keep looking.',
      'Certifications that indicate science-based training: CPDT-KA (Certified Professional Dog Trainer), CAAB (Certified Applied Animal Behaviorist), ACVB (American College of Veterinary Behaviorists). These require education, testing, and adherence to ethical standards.',
      'A veterinary behaviorist is a veterinarian with additional board certification in behavior. They can prescribe medication AND design behavior modification plans. For severe reactivity, this is the gold standard. Your regular vet can provide a referral.',
      'Medication is not a last resort. For dogs with clinically significant anxiety driving their reactivity, medication (SSRIs, trazodone, gabapentin) can lower the baseline anxiety enough for training to actually work. Think of it as lowering the volume on their fear so they can hear the lessons.',
      'Red flags in a trainer: they guarantee results, they use prong/shock/choke collars for reactivity, they talk about dominance or pack theory, they don\'t want you present during sessions, they offer board-and-train as a fix for reactivity. These approaches suppress behavior through fear and often make things worse long-term.'
    ],
    tips: [
      'Good trainers will not judge you for your dog\'s behavior. If a trainer makes you feel ashamed or guilty about your reactive dog, find a different trainer. You need support, not shame.',
      'Ask for references from clients who had similar issues to yours. A trainer who is great with puppy basics might have no experience with serious reactivity.',
      'Budget for ongoing sessions. Reactivity is not a one-session fix. Expect 6-12 private sessions over 2-3 months for moderate cases. The investment is worth it for a dog you can walk without dread.',
      'Online consultations with veterinary behaviorists are now widely available and can be a more affordable starting point than in-person visits. Several universities offer remote behavior consultations.'
    ]
  },
];
