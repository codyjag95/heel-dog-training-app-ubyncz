import { Lesson } from '../categoryData';

/**
 * BARKING & ALERT CONTROL
 * New category (v1.2), the #1 owner complaint that had zero coverage.
 * First 3 lessons free, rest premium.
 */
export const barkingAlertControlLessons: Lesson[] = [
  {
    id: 'ba_1',
    title: 'Decode the Bark',
    description: 'Learn what your dog is actually saying before you try to change it',
    duration: 6,
    difficulty: 1,
    isPremium: false,
    steps: [
      'For the next two days, don\'t try to stop any barking. Instead, keep a simple note on your phone: what happened right before the bark, what the bark sounded like, and what made it stop',
      'Learn the big five: alert barking (sharp, rapid, "something\'s there!"), demand barking (single, spaced barks aimed at you, "pay attention!"), boredom barking (flat, repetitive, often when alone), fear barking (lower, mixed with backing away), and excitement barking (high-pitched, with a loose wiggly body)',
      'Match each entry in your notes to one of the five types. Most dogs have one or two dominant types, that\'s your real problem, and it\'s rarely "all barking"',
      'Notice what currently ends the barking. If it\'s you getting up, talking to them, or giving them something, write that down honestly. That\'s what the barking earns, and it\'s why it keeps happening',
      'Pick your dog\'s number one bark type. The rest of this category gives you a specific plan for each type, and they\'re NOT interchangeable, fixing demand barking with an alert-barking technique will backfire'
    ],
    tips: [
      'Barking is communication, not disobedience. Your dog isn\'t broken, they\'re using the only megaphone they have. Your job is to answer the underlying need, not just mute the speaker',
      'Punishing barking without knowing the type is how you get a dog who skips the warning and goes straight to bigger behaviors. The bark is information, you want to change it, not suppress it blindly',
      'Two days of notes feels slow when the barking is driving you crazy. Do it anyway. Every lesson after this one works twice as fast when you\'re treating the right type'
    ]
  },
  {
    id: 'ba_2',
    title: 'Teaching "Quiet"',
    description: 'Build a real quiet cue by paying for silence, not shouting over noise',
    duration: 8,
    difficulty: 2,
    isPremium: false,
    steps: [
      'Wait for (or gently trigger) a mild barking moment, a knock on the wall works for most dogs. Let them bark two or three times. You need barking to exist before quiet can be rewarded',
      'Hold a treat to their nose. Dogs can\'t sniff and bark at the same time, it\'s a physical interrupt, not a bribe. The instant the barking stops, say "quiet" in a calm, low voice',
      'Count two full seconds of silence, then mark "yes!" and give the treat. The pause matters: you\'re paying for sustained quiet, not for the split second between barks',
      'Repeat 5-8 times per session, one or two sessions a day. Within a week, start saying "quiet" BEFORE the treat comes out. Reward from your pocket when they go silent',
      'Slowly stretch the silence requirement: 2 seconds, then 5, then 10. If they start barking again before the reward, no drama, just wait for quiet and restart the count',
      'Once "quiet" works in calm setups, practice with slightly bigger triggers: TV doorbell sounds at low volume, a family member knocking. Real-world triggers come later, don\'t rush to the mailman yet'
    ],
    tips: [
      'Yelling "QUIET!" at a barking dog is, from the dog\'s perspective, you joining the barking. Now it\'s a group activity. Calm and low beats loud and frustrated every time',
      'If your dog won\'t take the treat during barking, the trigger is too strong for this stage. Move further from the trigger or use a weaker version and rebuild',
      'Practice when you don\'t need it, so it works when you do. A quiet cue that\'s only ever used mid-meltdown at the front door was never actually trained',
      'Keep sessions short. Five good reps beat twenty sloppy ones, this is a thinking game for your dog, and thinking is tiring'
    ]
  },
  {
    id: 'ba_3',
    title: '"Thank You, I\'ve Got It"',
    description: 'The alert-barking protocol: let them report, then take over the shift',
    duration: 7,
    difficulty: 2,
    isPremium: false,
    steps: [
      'Understand the deal you\'re making: alert barking is your dog doing a job, notifying you about a sound or sight. You\'re not firing them from the job. You\'re teaching them that one report is enough, because management (you) handles it from there',
      'When your dog alert-barks, go to them calmly and LOOK at what they\'re barking at. This matters, acknowledging the "threat" is what tells your dog the message was received',
      'Say your acknowledgment phrase once, "thank you, I\'ve got it", in a bored, unbothered tone. Your calmness is the actual information: pack management has assessed the threat and is unimpressed',
      'Immediately give them something specific to do instead: "go to your mat," "come," or scatter a small handful of kibble away from the window. The job now is disengaging, and disengaging pays',
      'Reward the disengage, not the bark. Treat comes when they walk away from the trigger with you, settle on the mat, or finish the scatter and check in with you',
      'Repeat with total consistency for two to three weeks. Every alert gets the same sequence: acknowledge → redirect → reward the walk-away. Dogs stop escalating when the first bark reliably gets a response'
    ],
    tips: [
      'This protocol works because it answers the need instead of fighting the dog. The dog barked to get the family\'s attention on a potential problem. They got it. Job complete',
      'The most common mistake: skipping the acknowledgment and going straight to "quiet!" For a committed watchdog, being ignored means the alarm must get LOUDER, you\'re training exactly what you don\'t want',
      'Herding and guardian breeds (Aussies included) take their neighborhood-watch duties seriously. You\'ll get much further negotiating with that instinct than trying to delete it',
      'If your dog re-alerts to the same trigger immediately, calmly repeat the sequence. Two or three cycles is normal early on. Twenty is not, that\'s usually window access that needs managing (next lesson)'
    ]
  },
  {
    id: 'ba_4',
    title: 'Doorbell Desensitization',
    description: 'Turn the doorbell from an air-raid siren into background noise',
    duration: 10,
    difficulty: 3,
    isPremium: true,
    steps: [
      'Find a recording of a doorbell (or use your video doorbell\'s chime in the app settings). Play it at the lowest volume where your dog notices but doesn\'t erupt, ears twitch, head turns, but no bark. That\'s your starting volume',
      'Play the sound, then immediately rain 4-5 small treats on the floor. Sound → treats. Repeat 8-10 times per session. You\'re rewiring the doorbell from "INTRUDER ALARM" to "snack bell"',
      'Raise the volume one notch per session ONLY if the previous session had zero barking. If they bark, you went too fast, drop back two notches and rebuild. Slow is fast here',
      'Once full-volume recordings are boring, add the context that usually predicts the doorbell: have a family member actually ring the real bell while you run the same treat routine inside',
      'Layer in the "Thank You, I\'ve Got It" protocol from the previous lesson for real visitors: bell rings, dog gets acknowledged, dog goes to mat, guest enters, mat pays out like a slot machine',
      'Practice fake visits weekly even after it\'s fixed. Doorbell reactivity rebuilds itself fast because every real delivery re-rehearses the old habit'
    ],
    tips: [
      'The doorbell is hard mode because it\'s the world\'s most reliable predictor of excitement, someone ALWAYS shows up after the sound. You\'re competing with a lifetime of perfect evidence',
      'If you have a video doorbell, silence the indoor chime entirely during the retraining weeks. Every unplanned ring at full volume undoes sessions of careful work',
      'A leash or baby gate during real guest arrivals prevents door-charging while the training catches up. Management isn\'t cheating, it\'s stopping the bad reps while you build good ones',
      'Multi-dog households: train each dog separately first. Two dogs at a door is a feedback loop, each one\'s barking is the other one\'s trigger'
    ]
  },
  {
    id: 'ba_5',
    title: 'Ending Window Patrol',
    description: 'Shut down the all-day bark-at-everything shift at the front window',
    duration: 8,
    difficulty: 2,
    isPremium: true,
    steps: [
      'Accept the core truth: every hour your dog spends posted at the window barking at dogs, joggers, and delivery trucks is an hour of self-employed rehearsal. The behavior doesn\'t fade with practice, it gets better-rehearsed',
      'Block the view for the retraining period. Window film (frosted, adhesive, cheap, removable) on the bottom half of patrol windows is the single highest-impact change most owners can make. No view, no shift',
      'Give the laid-off patrol officer a new job in the same time slots. Morning window shift becomes morning snuffle mat, frozen Kong, or a chew. Boredom is half the reason the patrol exists',
      'When you catch them resting instead of patrolling, quietly drop a treat between their paws (Capturing Calm, from the Calm & Focus category, same mechanic). Being off-duty starts paying better than being on-duty',
      'If they bark at something anyway, run the "Thank You, I\'ve Got It" sequence, then escort them away from the window. Same response, every time, from every family member',
      'After 3-4 quiet weeks, peel back the film gradually, top window first, then more. If patrol resumes, film goes back on for another two weeks. The dog decides the timeline'
    ],
    tips: [
      'Owners resist window film because it feels like giving up. It\'s the opposite, it\'s cutting off the behavior\'s oxygen supply while you retrain. Most homes can remove it within a couple of months',
      'A dog barking out the window is winning every single round: they bark, the mailman leaves. From your dog\'s perspective they have a 100% success rate at repelling intruders. That\'s why it\'s addictive',
      'Couch positioned so your dog\'s favorite perch faces the window? Rearrange it for a month. Environmental design beats willpower, yours and theirs',
      'For serious patrol dogs, add a daily "legal sniffing" outlet: a 15-minute slow walk where they sniff everything. Surveillance is an information-gathering need; give it a better channel'
    ]
  },
  {
    id: 'ba_6',
    title: 'Boredom Barking',
    description: 'The bark that means "I have nothing to do", and the fix that isn\'t more barking practice',
    duration: 10,
    difficulty: 2,
    isPremium: true,
    steps: [
      'Identify it honestly: flat, repetitive, rhythmic barking, often at nothing visible, often when alone or ignored, sometimes paired with pacing. This bark isn\'t about the outside world. It\'s about an empty schedule',
      'Audit your dog\'s day like a calendar: how many minutes of sniffing, chewing, problem-solving, and real exercise are actually in it? Most boredom barkers are getting a fraction of what their brain needs, especially working breeds',
      'Add one "brain meal" per day: feed at least one meal through a snuffle mat, puzzle feeder, scattered in the yard, or rolled in a towel. Ten minutes of foraging drains more energy than you\'d think',
      'Add one daily chew/lick session: frozen Kong, lick mat, or a safe long-lasting chew. Licking and chewing are self-soothing behaviors that lower arousal, they\'re the opposite of barking, chemically speaking',
      'Schedule two short training sessions a day (5 minutes each, any lessons from this app count). A dog who\'s used their brain twice a day has dramatically less fuel for the 4pm bark-at-the-ceiling concert',
      'Never respond to boredom barking with attention, even angry attention, for a bored dog, being yelled at is programming. It\'s the most interesting thing that\'s happened all afternoon. Meet the need BEFORE the barking starts, on your schedule'
    ],
    tips: [
      'A good rule: tired dogs bark less, but MENTALLY tired beats physically tired. A 5k run creates a fitter barker; twenty minutes of nosework creates a napper',
      'High-energy breeds don\'t have an off switch installed at the factory. You build it, enrichment plus Capturing Calm is the installation kit',
      'If the barking happens mostly when your dog is completely alone, video them. Constant vocalization + pacing + destruction when alone can be separation distress, which is a different problem needing a different (gentler) plan',
      'Rotate toys weekly. The same puzzle feeder every day for a year is a job your dog already automated'
    ]
  },
  {
    id: 'ba_7',
    title: 'Demand Barking: Stop Paying the Toll',
    description: 'The bark aimed straight at you, and how to stop being a vending machine',
    duration: 8,
    difficulty: 3,
    isPremium: true,
    steps: [
      'Recognize the pattern: single spaced barks, eyes locked on you, usually while you\'re eating, working, or on the phone. Translation: "Excuse me. EXCUSE ME. The service here has declined." Every time it works, you\'ve confirmed the toll booth',
      'Make the barking stop paying, completely. When demand barking starts, become furniture: no eye contact, no talking, no touching, no sighing dramatically. Any response is a payment, including "no!"',
      'Brace for the extinction burst: the barking WILL get worse before it stops, usually for several days. This is your dog testing whether the toll booth is really closed or just slow today. If you cave during the burst, you\'ve taught them the new price: bark longer',
      'The instant they give up and do anything else, sit quietly, lie down, walk away, THAT gets warm attention or a treat within a second or two. Silence becomes the new currency',
      'Pre-pay the need on your schedule: if dinner-time demand barking is the pattern, give a stuffed Kong BEFORE you sit down to eat. Meeting needs proactively isn\'t spoiling; it\'s removing the reason for the toll booth',
      'Get the whole household aligned. One family member who cracks under barking pressure keeps the behavior on a slot-machine payout schedule, which is the strongest schedule there is'
    ],
    tips: [
      'Demand barking exists because it worked. That\'s uncomfortable but useful: behavior that stops paying eventually stops happening. Physics, not magic',
      'The extinction burst is where 90% of owners fail. Day 3 of louder barking feels like the plan is backfiring. It\'s actually the sign it\'s working, hold the line',
      'Teach an approved "ask" as a replacement: a quiet sit in front of you can become the official request channel for attention or play. Dogs need SOME way to ask, give them a polite one',
      'Never use the quiet cue from lesson 2 for demand barking, you\'d be responding, which is paying. "Quiet" is for alert barking. Demand barking gets nothing'
    ]
  },
  {
    id: 'ba_8',
    title: 'Barking at Guests',
    description: 'From chaos-at-the-door to a dog who greets like a professional',
    duration: 12,
    difficulty: 3,
    isPremium: true,
    steps: [
      'Split the problem in two: the door moment (doorbell + entry, covered by Doorbell Desensitization) and the guest-in-house phase, where some dogs keep orbiting and barking at the "intruder" for an hour. This lesson is phase two',
      'Set up the environment before guests arrive: dog on leash or behind a gate, mat in the room but at a distance from the guest, high-value treats staged where you\'ll sit',
      'Coach your guest with one rule: completely ignore the dog. No eye contact, no talking to the dog, no reaching out. Pressure from strangers is what fuels most in-house barking, remove it and half the problem evaporates',
      'Work the mat: dog settles on mat → treats flow. Dog gets up to investigate → calmly return them. If they can sniff the (still-ignoring) guest calmly, fine, calm investigation is allowed, orbiting and barking is not',
      'Have the GUEST become the treat dispenser only after the dog is fully settled, tossed gently to the floor near the dog, never lured from the hand. The lesson: calm dogs get paid by visitors; loud dogs get nothing',
      'End the session before your dog runs out of self-control. Twenty good minutes then off to another room with a Kong beats ninety minutes ending in a barking relapse. Success is a training decision, not luck'
    ],
    tips: [
      'The dogs who bark at guests for an hour are usually conflicted: interested in the person but not confident about them. The ignore-the-dog rule works because it lets the dog gather information at their own pace',
      'Fear-based guest barking (barking from a distance, retreating if the guest moves) needs extra distance and much slower progress. Never let a guest corner or reach for a scared dog, that\'s how "he barked" becomes "he snapped"',
      'Recruit a patient friend for a fake visit before trying this with real company. Training reps with someone who follows instructions beat trial-by-fire with your in-laws',
      'A dragging leash (attached, not held) during early guest visits gives you calm physical control without grabbing a collar mid-arousal'
    ]
  },
  {
    id: 'ba_9',
    title: 'Barking on Walks',
    description: 'Dogs, squirrels, skateboards, teach disengagement before the explosion',
    duration: 10,
    difficulty: 3,
    isPremium: true,
    steps: [
      'Find your dog\'s threshold: the distance at which they notice a trigger (dog, jogger, skateboard) but can still eat, think, and respond to their name. Every dog has one. Your entire job is working AT it, not past it',
      'Play the Engage-Disengage game: dog looks at trigger → mark "yes!" the moment they look → they turn back to you for the treat. Looking at the trigger CALMLY becomes a rewardable behavior instead of the first domino',
      'After several sessions, wait a beat before marking. Many dogs start looking at the trigger and immediately snapping their head back to you, the "check it, cash it" pattern. That\'s the goal state',
      'Close distance gradually across weeks, not minutes. Ten feet closer per successful session is aggressive progress. If barking happens, you\'ve found the threshold\'s edge, add distance and keep working',
      'Use emergency U-turns without drama when surprised (trigger appears too close): happy voice, "let\'s go!", turn and move away briskly, treat on the move. Escaping over threshold isn\'t failure, staying there is',
      'Pattern games fill the gap in tight spaces: "find it" (treat tossed in grass) or "1-2-3-treat" walking rhythm gives your dog a familiar task to do while a trigger passes. Busy brains bark less'
    ],
    tips: [
      'A barking, lunging dog isn\'t dominant or protective on walks, they\'re over threshold, which means the thinking brain is offline. No cue works on an offline brain. Distance is the only reset button',
      'Tight leash = pressure = more barking. Practice keeping the leash smiling (loose arc) even when you\'re nervous. Your tension travels down the leash like a phone line',
      'If your dog barks at SOME dogs (usually while dragging you toward them, tail loose) it may be frustrated greeting, not fear. Same training, but know that these dogs often improve fastest with structured parallel walks',
      'Serious lunging with teeth, or barking paired with panic, is Reactive Dog category territory, this lesson handles everyday walk barking, not full reactivity. No shame in the bigger program; that\'s what it\'s for'
    ]
  },
  {
    id: 'ba_10',
    title: 'The Calm Alert Dog',
    description: 'Proofing it all: one bark, a look at you, and back to napping',
    duration: 12,
    difficulty: 4,
    isPremium: true,
    steps: [
      'Define the finished product so everyone knows the standard: trigger happens → dog gives one or two barks (or just perks up) → looks to you → you acknowledge → dog disengages and settles. That\'s a trained alert dog. Total silence was never the goal',
      'Run trigger drills for each of your dog\'s real-world triggers, one per session: doorbell, window sighting, guest arrival, walk encounter. Rotate through the week like a workout split',
      'Add difficulty deliberately: doorbell WHILE you\'re in another room. Guest who talks loudly. Two triggers back-to-back. Each layer gets rehearsed at low intensity before real life tests it',
      'Transfer the protocols to every family member, kids included. The acknowledgment phrase, the mat send, the no-payment rule for demand barking, a dog can\'t hold a standard the household doesn\'t share',
      'Build the maintenance habit: one fake doorbell drill and one Engage-Disengage rep per week, forever. Two minutes a week keeps the skills rust-free; zero minutes a week means retraining next year',
      'Expect regressions at predictable times: adolescence, moving house, new baby, new neighbor dog. Regression means "run the protocols again for two weeks," not "the training failed." You have the tools now'
    ],
    tips: [
      'The finish line isn\'t a silent dog, it\'s a dog whose alerts are brief, informative, and end on your signal. That dog is genuinely useful. A silent dog and a broken alarm are hard to tell apart',
      'If one specific trigger stays stubborn after everything, isolate it and go back to that lesson\'s protocol at half the intensity for a week. Stubborn triggers are almost always a threshold problem, not a stubborn dog',
      'Track your wins: note how many barks per doorbell this month versus when you started. Barking improvement is gradual and easy to undercount, the data will surprise you',
      'When guests say "wow, your dog just... stopped," you\'re allowed to be smug. You earned it one boring, consistent rep at a time'
    ]
  },
];
