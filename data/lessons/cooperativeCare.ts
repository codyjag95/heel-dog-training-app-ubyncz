/**
 * Cooperative Care Category
 * 9 lessons: 1 free intro, 8 premium
 * PLACEMENT: data/lessons/cooperativeCare.ts
 */

import { Lesson } from '../categoryData';

export const COOPERATIVE_CARE_LESSONS: Lesson[] = [
  // ── FREE INTRO ──
  {
    id: 'cc_1',
    title: 'Why Cooperative Care Matters',
    description: 'Your dog needs grooming, vet visits, and handling for their entire life. Make it easy on both of you.',
    duration: 8,
    difficulty: 1,
    isPremium: false,
    steps: [
      'Every dog will need their nails trimmed, ears cleaned, teeth examined, and body handled by strangers for their entire life. Most dogs hate it. Most owners dread it. This doesn\'t have to be your reality.',
      'Cooperative care is a training approach where your dog voluntarily participates in grooming and medical procedures. Instead of holding them down and hoping for the best, you teach them to offer a behavior (like a chin rest) that says "I\'m ready, you can proceed."',
      'The foundation is simple: if your dog holds still, you proceed. If your dog moves away, you stop. They always have the option to say "not yet." This sounds slow, but it builds a dog who genuinely trusts the process and relaxes into it instead of fighting.',
      'The alternative (forcing it) works short-term but creates long-term problems. A dog who learns that nail trimming involves being pinned down and having no control will fight harder every single time. A dog who learns they can stop the process by moving away actually needs to stop it less often.',
      'Start with the basics in this intro lesson: touch your dog\'s paws for 1 second, treat. Touch their ear flap, treat. Lift their lip to see teeth, treat. You\'re building a simple association: being touched in these areas predicts something good.',
      'Do this for 2-3 minutes a day, every day, for a week. No clippers, no ear solution, no toothbrush yet. Just touching and treating. Building the foundation before introducing the tools is the key to making cooperative care actually work.'
    ],
    tips: [
      'If your dog pulls their paw away when you reach for it, you\'re going too fast. Back up to just touching their leg, then their ankle, then the top of the paw. Progress one inch at a time.',
      'Use the highest-value treats for cooperative care training. Nail trims deserve steak, not kibble. The reward needs to outweigh the discomfort.',
      'Puppies are a blank slate for cooperative care. If you start this from day one, you can have a dog who genuinely lies still for nail trims by 6 months old. Adult dogs with bad experiences take longer but still get there.',
      'Cooperative care skills transfer to the vet. A dog who lets you handle them at home will be significantly calmer during vet exams. Vets will love you for this.'
    ]
  },

  // ── PREMIUM LESSONS ──
  {
    id: 'cc_2',
    title: 'Nail Trimming Desensitization',
    description: 'Turn the most dreaded grooming task into something your dog actually tolerates.',
    duration: 15,
    difficulty: 3,
    isPremium: true,
    steps: [
      'Nail trimming causes more owner-dog conflict than any other grooming task. Before you touch the clippers, you need to know why dogs hate it. Their paws are sensitive, the tool makes a weird sound, the sensation of the cut is unfamiliar, and most dogs have been quicked at least once (which genuinely hurts and creates lasting fear).',
      'Week 1: The clippers exist near your dog. Set the clippers on the ground near your dog during treat time. Clip the air (so they hear the sound) from across the room while dropping treats. Touch the clippers to their leg briefly, treat. That\'s it for week one.',
      'Week 2: Paw handling with clippers visible. Hold their paw for 2 seconds, treat, release. Squeeze a toe gently, treat, release. Touch the clippers to the top of their paw (don\'t clip), treat, release. If they pull away at any point, make the next rep easier.',
      'Week 3: Position the clippers on a nail without cutting. Just hold the clipper around the nail for 1 second, treat, remove. Repeat 5-10 times per paw. This is the "mock trim" phase. Your dog learns that the clippers touching their nail doesn\'t hurt.',
      'Week 4: First real clip. One nail. The tiniest sliver possible. Not the whole nail, just the very tip. Treat party afterward. One nail per day for the first week. Then two nails per session. Build gradually over weeks, not days.',
      'If you quick the nail (hit the blood vessel): stay calm. Apply styptic powder or cornstarch. Give your dog a break and their favorite treat. Don\'t try another nail that day. One quick sets you back, but it doesn\'t ruin all your work. Go slower next time.'
    ],
    tips: [
      'A Dremel (grinding tool) is often easier than clippers for fearful dogs because there\'s no sudden pressure and no risk of quicking. But the sound and vibration need their own desensitization process first.',
      'For dark nails where you can\'t see the quick: trim tiny slivers at a time and look at the cut surface. When you see a gray or pink dot appear in the center of the nail, stop. That\'s the quick.',
      'Scratch boards (a board covered in sandpaper that the dog scratches with their nails as a trick) can maintain nail length between trims and build paw confidence. Some dogs file their own nails this way and never need clippers.',
      'If your dog is severely nail-phobic (shaking, snapping, hiding), consider having your vet do the trims under mild sedation while you work on the desensitization at home. This prevents the phobia from getting worse while you build new associations.'
    ]
  },
  {
    id: 'cc_3',
    title: 'Ear Cleaning Protocol',
    description: 'How to clean your dog\'s ears without a wrestling match.',
    duration: 10,
    difficulty: 2,
    isPremium: true,
    steps: [
      'Ear cleaning is important for dogs with floppy ears, dogs who swim, and breeds prone to ear infections (spaniels, retrievers, poodles, bulldogs). But pouring cold liquid into a sensitive ear with no preparation is a recipe for a dog who runs when they see the bottle.',
      'Step 1: Ear handling practice. Flip the ear flap up, treat. Hold it up for 2 seconds, treat. Touch the inside of the ear flap with your finger, treat. Rub the base of the ear, treat. Do this daily for a week.',
      'Step 2: Introduce the bottle. Let your dog sniff the ear cleaning solution. Touch the bottle tip to the outside of the ear, treat. Touch it to the inside of the ear flap (don\'t squeeze yet), treat.',
      'Step 3: One tiny drop. Squeeze the smallest amount of solution just inside the ear opening. Massage the base of the ear (most dogs actually enjoy this part). Let them shake. Treat generously.',
      'Step 4: Full clean. Squeeze solution into the ear canal as directed by your vet or the product label. Massage the base for 10-15 seconds. Let them shake (cover yourself). Wipe the inside of the ear flap with a cotton ball or gauze. Never stick anything into the ear canal.',
      'Frequency: follow your vet\'s recommendation. Over-cleaning is almost as bad as under-cleaning. Most healthy ears need cleaning every 2-4 weeks. Dogs with chronic issues may need weekly cleaning.'
    ],
    tips: [
      'Warm the ear solution to body temperature by holding the bottle in your hand for a few minutes before use. Cold liquid in the ear is a major reason dogs hate this process.',
      'Do ear cleaning in a bathroom or somewhere easy to wipe down. They will shake solution everywhere. Accept this reality.',
      'Check ears regularly even when not cleaning. Red, inflamed, smelly, or goopy ears need a vet visit, not just a cleaning. Cleaning an infected ear can make things worse.',
      'For Aussies and other upright-eared breeds: ear problems are less common but not impossible. Check weekly, clean monthly, and watch for scratching or head shaking as signs something is off.'
    ]
  },
  {
    id: 'cc_4',
    title: 'Teeth Brushing Introduction',
    description: 'Dental disease affects 80% of dogs by age 3. Prevention starts here.',
    duration: 12,
    difficulty: 2,
    isPremium: true,
    steps: [
      'Dental disease is the most common health issue in dogs. By age 3, roughly 80% of dogs show signs of gum disease. Brushing prevents painful infections, expensive dental procedures, and in severe cases, organ damage from bacteria entering the bloodstream through inflamed gums.',
      'Day 1-3: Let your dog lick dog-specific toothpaste off your finger. Most enzymatic dog toothpaste comes in flavors like poultry or beef. Let them think this is a treat, because it kind of is.',
      'Day 4-7: While they\'re licking the paste, slide your finger along their gum line on the outside of the teeth. You don\'t need to open their mouth. Just lift the lip and run your paste-covered finger along the gums. Reward for tolerance.',
      'Day 8-10: Introduce the toothbrush (or finger brush, which is easier to start with). Let them lick paste off the brush. Then do a few gentle strokes along the outer surfaces of the front teeth only. 5 seconds of actual brushing is fine for now.',
      'Day 11-14: Gradually work your way to the back teeth, which is where most plaque builds up. The canine teeth (the big fangs) and the large premolars in the back are the priority. Focus on the outer surfaces only.',
      'Ongoing: aim for daily brushing, but even 3 times a week makes a significant difference. Each session should be 30-60 seconds total. It doesn\'t need to be a full human-style dental routine. Quick and consistent beats thorough and rare.'
    ],
    tips: [
      'NEVER use human toothpaste on dogs. The fluoride and xylitol can be toxic. Always use dog-specific enzymatic toothpaste.',
      'If your dog clamps their mouth shut, don\'t pry it open. You can brush the outer surfaces of all teeth with the mouth closed by just lifting the lip. The tongue takes care of the inner surfaces naturally.',
      'Dental chews and raw bones can supplement brushing but don\'t replace it. Think of them like mouthwash for humans: helpful, but not a substitute for the toothbrush.',
      'If your dog already has brown buildup, visible tartar, red gums, or bad breath, see your vet first. They may need a professional dental cleaning before home maintenance can be effective.'
    ]
  },
  {
    id: 'cc_5',
    title: 'Bath Time Without the Battle',
    description: 'Make bath time something your dog accepts rather than fears.',
    duration: 12,
    difficulty: 2,
    isPremium: true,
    steps: [
      'Most dogs don\'t naturally love baths. The slippery tub surface, the running water, the strange feeling of being wet, the noise of the spray, and the restriction of being in a small space all combine into a stressful experience. But baths are a necessity, so let\'s make them bearable.',
      'Step 1: Make the tub or shower fun outside of bath time. Toss treats in the dry tub. Let your dog jump in and eat treats, then jump out. No water, no pressure. Just "the tub is where chicken lives."',
      'Step 2: Add a non-slip mat to the bottom of the tub. Slipping is one of the biggest reasons dogs panic in the tub. A rubber bath mat or a towel on the bottom gives them secure footing.',
      'Step 3: Add water gradually. Run the faucet at a trickle while your dog eats treats in the tub. Splash a tiny amount of warm water on their feet. Not a full bath. Just feet wet, treats flowing, then done.',
      'Step 4: Spread peanut butter or squeeze cheese on the wall of the tub at your dog\'s nose height. This is the "lick mat" strategy. While they\'re focused on licking, you wet their body, apply shampoo, and rinse. The licking is both a distraction and a genuine calming behavior.',
      'Step 5: For the full bath, use lukewarm water (not cold, not hot). Start wetting from the back end, not the face. Save the head for last. Rinse thoroughly because leftover soap causes itching. Keep the whole process under 10 minutes.'
    ],
    tips: [
      'A detachable shower head or a pitcher for rinsing gives you more control than a running faucet and is less scary for most dogs.',
      'Don\'t bathe your dog more than once every 4-6 weeks unless they\'re genuinely dirty or your vet recommends it. Over-bathing strips natural oils and causes dry, itchy skin.',
      'Dry thoroughly with a towel. If using a blow dryer, introduce it the same way you\'d introduce any scary sound: at a distance, on low, paired with treats, gradually closer.',
      'Some dogs do better with outdoor baths in warm weather. A kiddie pool with a few inches of warm water feels less restrictive than a tub. Worth trying if indoor baths are a nightmare.'
    ]
  },
  {
    id: 'cc_6',
    title: 'Eye Drops and Medication',
    description: 'How to give your dog eye drops, ear drops, pills, and liquid medication without a fight.',
    duration: 10,
    difficulty: 3,
    isPremium: true,
    steps: [
      'Medication administration is stressful because it usually happens when your dog is already sick and not feeling great. Building these skills before you need them means medication time is routine, not a crisis.',
      'For pills: the simplest method is hiding them in food. Pill pockets (commercial treat with a hole for the pill), cheese, peanut butter, or deli meat. Give a plain treat first, then the pill treat, then another plain treat. The "treat, pill treat, treat" sequence prevents them from spitting out the pill.',
      'For dogs who find and spit out every pill: ask your vet about crushing and mixing with food (not all medications can be crushed). Or use the direct method: tilt their head up slightly, open the jaw gently, place the pill as far back on the tongue as possible, close the mouth, and stroke the throat to encourage swallowing. Follow immediately with a treat.',
      'For liquid medication: use the syringe method. Tilt the head slightly up, insert the syringe tip into the cheek pouch (the space between the teeth and the cheek), and squeeze slowly. Don\'t squirt directly down the throat because this can cause choking.',
      'For eye drops: approach from behind or from the side, not straight at their face. Use one hand to gently hold the head tilted slightly up. With the other hand, rest it on their forehead for stability and squeeze the drops in. Treat immediately after.',
      'Practice all of these with fake medications first. Empty syringes with water, plain eye drops (saline), empty pill pockets. Build the muscle memory and the dog\'s comfort before the real thing is needed.'
    ],
    tips: [
      'If your dog needs daily medication for a chronic condition, consistency is your friend. Same time, same place, same routine every day. Dogs who know the pattern accept it faster.',
      'For dogs who are extremely difficult to medicate, ask your vet about compounding pharmacies. They can turn pills into flavored liquids or even transdermal gels that absorb through the ear skin.',
      'Never hold a dog down forcefully to give medication unless it\'s a medical emergency. Forcing creates fear, and a fearful dog who needs daily medication is a recipe for escalating conflict.',
      'Muzzle training (see handling lesson) is a safety tool for medication administration with dogs who snap or bite during the process. The muzzle isn\'t punishment. It\'s protection while you work on building cooperation.'
    ]
  },
  {
    id: 'cc_7',
    title: 'Vet Visit Preparation',
    description: 'Turn vet visits from a trauma into a routine your dog handles calmly.',
    duration: 12,
    difficulty: 2,
    isPremium: true,
    steps: [
      'Most dogs are terrified of the vet because every single visit involves unpleasant things: strange smells, being on a cold metal table, strangers poking and prodding, and sometimes pain (shots, blood draws). Counter-conditioning for the vet starts outside the clinic.',
      'Happy visits: call your vet and ask if you can stop by 2-3 times for "happy visits" where nothing happens. You walk in, your dog gets treats from the front desk staff, you weigh your dog on the lobby scale, and you leave. No exam, no poking, just positive associations.',
      'Practice at home: cold metal surface (baking sheet on the floor, treats for standing on it). Being lifted onto a raised surface (use a sturdy table). Having someone hold them still while another person touches their body. Being restrained gently in a standing position.',
      'On exam day: bring your dog slightly hungry (better treat motivation). Bring their highest-value treats. Arrive 10 minutes early so they can sniff the lobby without time pressure. Ask if you can wait outside or in the car if the waiting room is chaotic.',
      'During the exam: feed treats continuously through the exam. If your vet is okay with it, you handle the treat delivery while they handle the medical parts. Your dog is getting steak while the stethoscope is on their chest. This changes the emotional experience completely.',
      'After the exam: don\'t rush home. Take a short calm walk, play a quick game, or just sit in the car for 5 minutes with treats. End the outing on something positive so the lasting memory is good.'
    ],
    tips: [
      'Fear Free certified veterinarians specifically design their practice to reduce pet stress. Look for the Fear Free certification on your vet\'s website. These clinics use things like pheromone diffusers, non-slip surfaces, and treat-based handling protocols.',
      'If your dog is severely vet-phobic (shaking, aggression, urinating in fear), talk to your vet about pre-visit sedation. A mild sedative given at home before the appointment can prevent the terror response that reinforces the phobia.',
      'Bring your own towel or blanket to put on the exam table. The familiar scent reduces stress and the fabric prevents slipping on the metal surface.',
      'Don\'t lie to your dog. If they\'re about to get a shot, don\'t pretend everything is fine. Just keep the treats flowing and be matter-of-fact about it. They know when something is happening. Your calmness teaches them it\'s manageable.'
    ]
  },
  {
    id: 'cc_8',
    title: 'The Chin Rest: Your Cooperative Care Foundation',
    description: 'The single most useful cooperative care behavior. Teaches your dog to consent to handling.',
    duration: 10,
    difficulty: 2,
    isPremium: true,
    steps: [
      'The chin rest is the cornerstone of cooperative care. Your dog rests their chin on your hand (or a surface). As long as their chin stays, you proceed with the grooming or handling. If they lift their chin, you stop. They are literally giving and withdrawing consent through this behavior.',
      'Sit on the floor with your palm flat, facing up. When your dog sniffs your hand, mark and treat (from the other hand). Repeat until they\'re repeatedly touching their nose to your palm.',
      'Now wait for them to linger. Don\'t mark the instant touch. Wait for 1 second of sustained contact. Then 2 seconds. Then 3. You\'re building duration. If they lift their head, no problem, just wait for the next rep.',
      'Shape it into a true chin rest: wait for the moment their chin settles onto your palm with some weight. Mark that specifically. The feel of weight on your hand means they\'re relaxed, not just hovering.',
      'Once the chin rest is solid (10+ seconds), start pairing it with gentle handling. Chin on your hand, other hand touches their ear briefly. Chin stays, treat. Chin on your hand, other hand lifts a paw. Chin stays, treat. If the chin lifts at any point, stop the handling immediately.',
      'Transfer to different surfaces: your dog can chin rest on your knee, a table edge, a pillow, or a folded towel. Each new surface is useful for different grooming and vet scenarios.'
    ],
    tips: [
      'The chin rest works because it gives your dog agency. They\'re not being done to. They\'re participating. This single distinction changes the entire dynamic of grooming and handling.',
      'Start using chin rest during nail trims as soon as both skills are established. Chin on your partner\'s hand while you trim one nail. If the chin lifts, you stop. The dog learns they have control, and paradoxically, they exercise that control less often.',
      'Some dogs take to this in one session. Others need a week. Both are fine. Don\'t rush it because this behavior is the backbone of everything else in cooperative care.',
      'Kids can learn to be the chin rest holder during family grooming time. This gives the dog a familiar person to focus on and gives the kid a responsible role.'
    ]
  },
  {
    id: 'cc_9',
    title: 'Grooming Tool Introduction',
    description: 'How to introduce brushes, clippers, dremels, and other tools without creating fear.',
    duration: 10,
    difficulty: 2,
    isPremium: true,
    steps: [
      'Every grooming tool needs its own desensitization process. A dog who is fine with a brush might panic at nail clippers. Don\'t assume comfort with one tool means comfort with all of them.',
      'The universal protocol: Step 1, tool exists in the room (treat). Step 2, tool is near the dog (treat). Step 3, tool touches the dog briefly while turned off (treat). Step 4, tool is turned on near the dog (treat). Step 5, tool is used briefly on the dog (treat).',
      'For brushes and combs: start with the least intense brush (a soft bristle brush or rubber curry brush). Brush one stroke along their back (the least sensitive area), treat. Build to full grooming sessions over days, not minutes.',
      'For electric tools (clippers, dremels): the sound and vibration need separate desensitization. Turn the tool on across the room, treat. Move closer gradually over sessions. Touch the running tool to your own hand while feeding treats. Then touch the back of the tool (not the cutting surface) to the dog.',
      'For scissors around the face, paws, or sanitary areas: these are high-risk locations. Use blunt-tipped scissors only. Practice touching their face with your hands while treating before ever introducing scissors near their eyes, ears, or muzzle.',
      'For each tool: keep a log. Date, tool used, duration, dog\'s reaction (1-10 scale). This prevents you from pushing too fast and helps you see progress when it feels slow.'
    ],
    tips: [
      'Breed-specific grooming needs vary enormously. An Aussie needs different tools and frequency than a poodle or a bulldog. Research your breed\'s specific coat type before buying tools.',
      'A bad groomer can undo months of cooperative care work in one session. Interview groomers about their handling philosophy. Ask if they use force, restraint, or sedation. Observe their facility if possible.',
      'For double-coated breeds (Aussies, huskies, goldens): never shave the coat. It doesn\'t grow back the same and actually makes them hotter, not cooler. Use an undercoat rake instead.',
      'Start grooming sessions when your dog is calm and slightly tired, not when they\'re wound up and looking for stimulation. After a walk is ideal timing for most dogs.'
    ]
  },
];
