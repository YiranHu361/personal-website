package com.yiranhu.wordle.service;

import org.springframework.stereotype.Service;
import org.springframework.core.io.ClassPathResource;
import com.yiranhu.wordle.model.WordleResponse;
import java.util.*;
import java.io.*;
import java.util.stream.Collectors;

@Service
public class WordleSolver {
    
    private static final int LEN = 5;
    private List<String> words = new ArrayList<>();
    private List<String> vocab = new ArrayList<>();
    private List<Character> ban = new ArrayList<>();
    private List<Character> contain = new ArrayList<>();
    private Map<Integer, Character> sure = new HashMap<>();
    private List<Character>[] unsure = new ArrayList[LEN];
    private boolean delima = false;
    
    public WordleSolver() {
        initializeUnsureArray();
        loadWordList();
    }
    
    private void initializeUnsureArray() {
        for (int i = 0; i < LEN; i++) {
            unsure[i] = new ArrayList<>();
        }
    }
    
    private void loadWordList() {
        try {
            ClassPathResource resource = new ClassPathResource("wordle-answers.txt");
            BufferedReader reader = new BufferedReader(new InputStreamReader(resource.getInputStream()));
            String line;
            while ((line = reader.readLine()) != null) {
                words.add(line.trim());
                vocab.add(line.trim());
            }
            reader.close();
        } catch (IOException e) {
            // Fallback to a basic word list if file not found
            loadFallbackWords();
        }
    }
    
    private void loadFallbackWords() {
        String[] fallbackWords = {
            "aback", "abase", "abate", "abbey", "abbot", "abhor", "abide", "abled", "abode", "abort",
            "about", "above", "abuse", "abyss", "acorn", "acrid", "actor", "acute", "adage", "adapt",
            "adept", "admin", "admit", "adobe", "adopt", "adore", "adorn", "adult", "affix", "afire",
            "afoot", "afoul", "after", "again", "agape", "agate", "agent", "agile", "aging", "aglow",
            "agony", "agree", "ahead", "aider", "aisle", "alarm", "album", "alert", "algae", "alibi",
            "alien", "align", "alike", "alive", "allay", "alley", "allot", "allow", "alloy", "aloft",
            "alone", "along", "aloof", "aloud", "alpha", "altar", "alter", "amass", "amaze", "amber",
            "amend", "amiss", "amity", "among", "ample", "amply", "amuse", "angel", "anger", "angle",
            "angry", "angst", "anime", "ankle", "annex", "annoy", "annul", "anode", "antic", "anvil",
            "aorta", "apart", "aphid", "aping", "apnea", "apple", "apply", "apron", "aptly", "arbor",
            "ardor", "arena", "argue", "arise", "armor", "aroma", "arose", "array", "arrow", "arson",
            "artsy", "ascot", "ashen", "aside", "askew", "assay", "asset", "atoll", "atone", "attic",
            "audio", "audit", "augur", "aunty", "avail", "avert", "avian", "avoid", "await", "awake",
            "award", "aware", "awash", "awful", "awoke", "axial", "axiom", "axion", "azure", "bacon",
            "badge", "badly", "bagel", "baggy", "baker", "baler", "balls", "balmy", "banal", "banjo",
            "barge", "baron", "basal", "basic", "basil", "basin", "basis", "baste", "batch", "bathe",
            "baton", "batty", "bawdy", "bayou", "beach", "beady", "beard", "beast", "beech", "beefy",
            "befit", "began", "begat", "beget", "begin", "begun", "beige", "being", "belch", "belie",
            "belle", "belly", "below", "bench", "beret", "berry", "berth", "beset", "betel", "bevel",
            "bezel", "bible", "bicep", "biddy", "bigot", "bilge", "billy", "binge", "bingo", "biome",
            "birch", "birth", "bison", "bitch", "biter", "bitty", "black", "blade", "blame", "bland",
            "blank", "blare", "blast", "blaze", "bleak", "bleat", "bleed", "bleep", "blend", "bless",
            "blimp", "blind", "blink", "bliss", "blitz", "bloat", "block", "bloke", "blond", "blood",
            "bloom", "blown", "bluer", "bluff", "blunt", "blurb", "blurt", "blush", "board", "boast",
            "bobby", "boney", "bongo", "bonus", "booby", "boost", "booth", "booty", "booze", "boozy",
            "borax", "borne", "bosom", "bossy", "botch", "bough", "boule", "bound", "bowel", "boxer",
            "brace", "braid", "brain", "brake", "brand", "brash", "brass", "brave", "bravo", "brawl",
            "brawn", "bread", "break", "breed", "briar", "bribe", "brick", "bride", "brief", "brine",
            "bring", "brink", "briny", "brisk", "broad", "broil", "broke", "brood", "brook", "broom",
            "broth", "brown", "brunt", "brush", "brute", "buddy", "budge", "buggy", "bugle", "build",
            "built", "bulge", "bulky", "bully", "bunch", "bunny", "burly", "burnt", "burst", "bused",
            "bushy", "butch", "butte", "buxom", "buyer", "bylaw", "cabal", "cabby", "cabin", "cable",
            "cacao", "cache", "cacti", "caddy", "cadet", "cagey", "cairn", "camel", "cameo", "canal",
            "candy", "canny", "canoe", "canon", "caper", "caput", "carat", "cargo", "carol", "carry",
            "carve", "caste", "catch", "cater", "catty", "caulk", "cause", "cavil", "cease", "cedar",
            "cello", "chafe", "chaff", "chain", "chair", "chalk", "champ", "chant", "chaos", "chard",
            "charm", "chart", "chase", "chasm", "cheap", "cheat", "check", "cheek", "cheer", "chess",
            "chest", "chick", "chide", "chief", "child", "chili", "chill", "chime", "china", "chirp",
            "chock", "choir", "choke", "chomp", "chord", "chore", "chose", "chuck", "chump", "chunk",
            "churn", "chute", "cider", "cigar", "cinch", "circa", "civic", "civil", "clack", "claim",
            "clamp", "clang", "clank", "clash", "clasp", "class", "clean", "clear", "cleat", "cleft",
            "clerk", "click", "cliff", "climb", "cling", "clink", "cloak", "clock", "close", "cloth",
            "cloud", "clout", "clove", "clown", "cluck", "clued", "clump", "clung", "coach", "coast",
            "cobra", "cocoa", "colon", "color", "comet", "comfy", "comic", "comma", "conch", "condo",
            "conic", "copse", "coral", "corer", "corny", "couch", "cough", "could", "count", "coupe",
            "court", "coven", "cover", "covet", "covey", "cower", "coyly", "crack", "craft", "cramp",
            "crane", "crank", "crash", "crass", "crate", "crave", "crawl", "craze", "crazy", "creak",
            "cream", "credo", "creed", "creek", "creep", "creme", "crepe", "crept", "cress", "crest",
            "crick", "cried", "crier", "cries", "crime", "crimp", "crisp", "croak", "crook", "cross",
            "croup", "crowd", "crown", "crude", "cruel", "crumb", "crump", "crush", "crust", "crypt",
            "cubic", "cumin", "curio", "curly", "curry", "curse", "curve", "curvy", "cutie", "cyber",
            "cycle", "cynic", "daddy", "daily", "dairy", "daisy", "dally", "dance", "dandy", "datum",
            "daunt", "dealt", "death", "debar", "debit", "debug", "debut", "decal", "decay", "decor",
            "decoy", "decry", "defer", "deign", "deity", "delay", "delta", "delve", "demon", "demur",
            "denim", "dense", "depot", "depth", "derby", "deter", "detox", "deuce", "devil", "diary",
            "dicey", "digit", "dilly", "dimly", "diner", "dingo", "dingy", "diode", "dirge", "dirty",
            "disco", "ditch", "ditto", "ditty", "diver", "dizzy", "dodge", "dodgy", "dogma", "doing",
            "dolly", "donor", "donut", "dopey", "doubt", "dough", "dowdy", "dowel", "downy", "dowry",
            "dozen", "draft", "drain", "drake", "drama", "drank", "drape", "drawl", "drawn", "dread",
            "dream", "dress", "dried", "drier", "drift", "drill", "drink", "drive", "droit", "droll",
            "drone", "drool", "droop", "dross", "drove", "drown", "druid", "drunk", "dryer", "dryly",
            "duchy", "dully", "dummy", "dumpy", "dunce", "dusky", "dusty", "dutch", "duvet", "dwarf",
            "dwell", "dwelt", "dying", "eager", "eagle", "early", "earth", "easel", "eaten", "eater",
            "ebony", "eclat", "edict", "edify", "eerie", "egret", "eight", "eject", "eking", "elate",
            "elbow", "elder", "elect", "elegy", "elfin", "elide", "elite", "elope", "elude", "email",
            "embed", "ember", "emcee", "empty", "enact", "endow", "enema", "enemy", "enjoy", "ennui",
            "ensue", "enter", "entry", "envoy", "epoch", "epoxy", "equal", "equip", "erase", "erect",
            "erode", "error", "erupt", "essay", "ester", "ether", "ethic", "ethos", "event", "every",
            "evict", "evoke", "exact", "exalt", "excel", "exert", "exile", "exist", "expel", "extol",
            "extra", "exult", "eying", "fable", "facet", "faint", "fairy", "faith", "false", "fancy",
            "fanny", "farce", "fatal", "fatty", "fault", "fauna", "favor", "feast", "fecal", "feign",
            "fella", "felon", "femme", "femur", "fence", "feral", "ferry", "fetal", "fetch", "fetid",
            "fetus", "fever", "fewer", "fiber", "fibre", "ficus", "field", "fiend", "fiery", "fifth",
            "fifty", "fight", "filch", "filet", "filly", "filmy", "filth", "final", "finch", "finer",
            "first", "fishy", "fixer", "fizzy", "fjord", "flack", "flail", "flair", "flake", "flame",
            "flank", "flare", "flash", "flask", "fleck", "fleet", "flesh", "flick", "flier", "fling",
            "flint", "flirt", "float", "flock", "flood", "floor", "flora", "floss", "flour", "flout",
            "flown", "fluff", "fluid", "fluke", "flume", "flung", "flunk", "flush", "flute", "flyer",
            "foamy", "focal", "focus", "foggy", "foist", "folio", "folly", "foray", "force", "forge",
            "forgo", "forte", "forth", "forty", "forum", "found", "foyer", "frail", "frame", "frank",
            "fraud", "freak", "freed", "freer", "fresh", "friar", "fried", "frill", "frisk", "fritz",
            "frock", "frond", "front", "frost", "froth", "frown", "froze", "fruit", "fudge", "fugue",
            "fully", "fungi", "funky", "funny", "furor", "furry", "fussy", "fuzzy", "gaffe", "gaily",
            "gamer", "gamma", "gamut", "gassy", "gaudy", "gauge", "gaunt", "gauze", "gavel", "gawky",
            "gayer", "gayly", "gazer", "gecko", "geeky", "geese", "genie", "genre", "ghost", "ghoul",
            "giant", "giddy", "girly", "girth", "given", "giver", "glade", "gland", "glare", "glass",
            "glaze", "gleam", "glean", "glide", "glint", "gloat", "globe", "gloom", "glory", "gloss",
            "glove", "glowy", "gluey", "gluon", "glute", "glyph", "gnarl", "gnash", "gnome", "godly",
            "going", "golem", "golly", "gonad", "goner", "goody", "gooey", "goofy", "goose", "gorge",
            "gouge", "gourd", "grace", "grade", "graft", "grail", "grain", "grand", "grant", "grape",
            "graph", "grasp", "grass", "grate", "grave", "gravy", "graze", "great", "greed", "green",
            "greet", "grief", "grill", "grime", "grind", "gripe", "grist", "gritty", "gross", "group",
            "grout", "grove", "growl", "grown", "gruel", "gruff", "grunt", "guard", "guava", "guess",
            "guest", "guide", "guild", "guile", "guilt", "guise", "gulch", "gully", "gumbo", "gummy",
            "guppy", "gusto", "gusty", "gypsy", "habit", "hairy", "halve", "handy", "happy", "hardy",
            "harem", "harpy", "harry", "harsh", "haste", "hasty", "hatch", "hater", "haunt", "haute",
            "haven", "havoc", "hawks", "hazel", "heady", "heard", "heart", "heath", "heave", "heavy",
            "hedge", "hefty", "heist", "helix", "hello", "hence", "heron", "hilly", "hinge", "hippo",
            "hippy", "hitch", "hoard", "hobby", "hocus", "hoist", "holly", "homer", "honey", "honor",
            "horde", "horny", "horse", "hotel", "hotly", "hound", "house", "hovel", "hover", "howdy",
            "human", "humid", "humor", "humph", "humus", "hunch", "hunky", "hurry", "husky", "hussy",
            "hutch", "hydro", "hyena", "hymen", "hyper", "icily", "icing", "ideal", "idiom", "idiot",
            "idler", "idyll", "igloo", "iliac", "image", "imbue", "impel", "imply", "inane", "inbox",
            "incur", "index", "indie", "inept", "inert", "infer", "ingot", "inlay", "inlet", "inner",
            "input", "inter", "intro", "inure", "ionic", "irate", "irony", "islet", "issue", "itchy",
            "ivory", "jaunt", "jazzy", "jelly", "jerky", "jetty", "jewel", "jiffy", "joint", "joist",
            "joker", "jolly", "joust", "judge", "juice", "juicy", "jumbo", "jumpy", "junta", "junto",
            "juror", "kappa", "karma", "kayak", "kebab", "kedge", "kempt", "keyed", "khaki", "kinky",
            "kiosk", "kitty", "knack", "knave", "knead", "kneed", "kneel", "knelt", "knife", "knock",
            "knoll", "known", "koala", "krill", "label", "labor", "laden", "ladle", "lager", "lance",
            "lanky", "lapel", "lapse", "large", "larva", "lasso", "latch", "later", "lathe", "latte",
            "laugh", "layer", "leach", "leafy", "leaky", "leant", "leapt", "learn", "lease", "leash",
            "least", "leave", "ledge", "leech", "leery", "lefty", "legal", "leggy", "lemon", "lemur",
            "leper", "level", "lever", "libel", "liege", "light", "liken", "lilac", "limbo", "limit",
            "linen", "liner", "lingo", "lipid", "lithe", "liver", "livid", "llama", "loamy", "loath",
            "lobby", "local", "locus", "lodge", "lofty", "logic", "login", "loopy", "loose", "lorry",
            "loser", "louse", "lousy", "lover", "lower", "lowly", "loyal", "lucid", "lucky", "lumen",
            "lumpy", "lunar", "lunch", "lunge", "lupus", "lurch", "lurid", "lusty", "lying", "lymph",
            "lynch", "lyric", "macaw", "macho", "macro", "madam", "madly", "mafia", "magic", "magma",
            "maize", "major", "maker", "mambo", "mamma", "mammy", "manga", "mange", "mango", "mangy",
            "mania", "manic", "manly", "manna", "manor", "maple", "march", "marry", "marsh", "mason",
            "masse", "match", "matey", "mauve", "maxim", "maybe", "mayor", "mealy", "meant", "meaty",
            "mecca", "medal", "media", "medic", "melee", "melon", "mercy", "merge", "merit", "merry",
            "metal", "meter", "metro", "micro", "midge", "midst", "might", "milky", "mimic", "mince",
            "miner", "minim", "minor", "minty", "minus", "mirth", "miser", "missy", "mocha", "modal",
            "model", "modem", "mogul", "moist", "molar", "moldy", "money", "month", "moody", "moose",
            "moped", "moral", "moron", "morph", "mossy", "motel", "motif", "motor", "motto", "moult",
            "mound", "mount", "mourn", "mouse", "mousy", "mouth", "mover", "movie", "mower", "mucky",
            "mucus", "muddy", "mulch", "mummy", "munch", "mural", "murky", "mushy", "music", "musky",
            "musty", "myrrh", "nadir", "naive", "nanny", "nasal", "nasty", "natal", "naval", "navel",
            "needy", "neigh", "nerdy", "nerve", "never", "newer", "newly", "newsy", "newts", "nicer",
            "niche", "niece", "night", "ninja", "ninny", "ninth", "noble", "nobly", "noise", "noisy",
            "nomad", "noose", "north", "nosey", "notch", "novel", "nudge", "nurse", "nutty", "nylon",
            "nymph", "oaken", "obese", "occur", "ocean", "octal", "octet", "odder", "oddly", "offal",
            "offer", "often", "olden", "older", "olive", "ombre", "omega", "onion", "onset", "opera",
            "opine", "opium", "optic", "orbit", "order", "organ", "other", "otter", "ought", "ounce",
            "outdo", "outer", "outgo", "ovary", "ovate", "overt", "ovine", "ovoid", "owing", "owner",
            "oxide", "ozone", "paddy", "pagan", "paint", "paler", "palsy", "panel", "panic", "pansy",
            "pants", "papal", "paper", "parer", "parka", "parry", "parse", "party", "pasta", "paste",
            "pasty", "patch", "patio", "patsy", "patty", "pause", "payee", "payer", "peace", "peach",
            "pearl", "pecan", "pedal", "penal", "pence", "penne", "penny", "perch", "peril", "perky",
            "pesky", "pesto", "petal", "petty", "phase", "phone", "phony", "photo", "piano", "picky",
            "piece", "piety", "piggy", "pilot", "pinch", "piney", "pinky", "pinto", "piper", "pique",
            "pitch", "pithy", "pivot", "pixel", "pixie", "pizza", "place", "plaid", "plain", "plait",
            "plane", "plank", "plant", "plate", "plaza", "plead", "pleat", "plied", "plier", "pluck",
            "plumb", "plume", "plump", "plunk", "plush", "poesy", "point", "poise", "poker", "polar",
            "polka", "polyp", "pooch", "poppy", "porch", "poser", "posit", "posse", "pouch", "pound",
            "pouty", "power", "prank", "prawn", "preen", "press", "price", "prick", "pride", "pried",
            "prime", "primo", "print", "prior", "prism", "privy", "prize", "probe", "prone", "prong",
            "proof", "prose", "proud", "prove", "prowl", "proxy", "prude", "prune", "psalm", "pubic",
            "pudgy", "puffy", "pulpy", "pulse", "punch", "pupil", "puppy", "puree", "purer", "purge",
            "purse", "pushy", "putty", "pygmy", "quack", "quail", "quake", "qualm", "quark", "quart",
            "quash", "quasi", "queen", "queer", "quell", "query", "quest", "queue", "quick", "quiet",
            "quill", "quilt", "quirk", "quite", "quota", "quote", "quoth", "rabbi", "rabid", "racer",
            "radar", "radii", "radio", "rainy", "raise", "rajah", "rally", "ralph", "ramen", "ranch",
            "randy", "range", "rapid", "rarer", "raspy", "ratio", "ratty", "raven", "rayon", "razor",
            "reach", "react", "ready", "realm", "rearm", "rebar", "rebel", "rebus", "rebut", "recap",
            "recur", "recut", "reedy", "refer", "refit", "regal", "rehab", "reign", "relax", "relay",
            "relic", "remit", "renal", "renew", "repay", "repel", "reply", "rerun", "reset", "resin",
            "retch", "retro", "retry", "reuse", "revel", "revue", "rhino", "rhyme", "rider", "ridge",
            "rifle", "right", "rigid", "rigor", "rinse", "ripen", "riper", "risen", "riser", "risky",
            "rival", "river", "rivet", "roach", "roast", "robin", "robot", "rocky", "rodeo", "roger",
            "rogue", "roomy", "roost", "rotor", "rouge", "rough", "round", "rouse", "route", "rover",
            "rowdy", "rower", "royal", "ruddy", "ruder", "rugby", "ruined", "ruler", "rumba", "rumor",
            "rural", "rusty", "sadly", "safer", "saint", "salad", "sally", "salon", "salsa", "salty",
            "salve", "salvo", "sandy", "saner", "sappy", "sassy", "satin", "satyr", "sauce", "saucy",
            "sauna", "saute", "savor", "savvy", "scald", "scale", "scalp", "scaly", "scamp", "scant",
            "scare", "scarf", "scary", "scene", "scent", "scion", "scoff", "scold", "scone", "scoop",
            "scope", "score", "scorn", "scour", "scout", "scowl", "scram", "scrap", "scree", "screw",
            "scrub", "scrum", "scuba", "sedan", "seedy", "segue", "seize", "semen", "sense", "sepia",
            "serif", "serum", "serve", "setup", "seven", "sever", "sewer", "shack", "shade", "shady",
            "shaft", "shake", "shaky", "shale", "shall", "shalt", "shame", "shank", "shape", "shard",
            "share", "shark", "sharp", "shave", "shawl", "shear", "sheen", "sheep", "sheer", "sheet",
            "sheik", "shelf", "shell", "shied", "shift", "shill", "shine", "shiny", "shire", "shirk",
            "shirt", "shoal", "shock", "shone", "shook", "shoot", "shore", "shorn", "short", "shout",
            "shove", "shown", "showy", "shrew", "shrub", "shrug", "shuck", "shunt", "shush", "shyly",
            "siege", "sieve", "sight", "sigma", "silky", "silly", "since", "sinew", "singe", "siren",
            "sissy", "sitar", "sixth", "sixty", "skate", "skier", "skiff", "skill", "skimp", "skirt",
            "skulk", "skull", "skunk", "slack", "slain", "slang", "slant", "slash", "slate", "slave",
            "sleek", "sleep", "sleet", "slept", "slice", "slick", "slide", "slime", "slimy", "sling",
            "slink", "sloop", "slope", "slosh", "sloth", "slump", "slung", "slunk", "slurp", "slush",
            "slyly", "smack", "small", "smart", "smash", "smear", "smell", "smelt", "smile", "smirk",
            "smite", "smith", "smock", "smoke", "smoky", "smote", "snack", "snail", "snake", "snaky",
            "snare", "snarl", "sneak", "sneer", "snide", "sniff", "snipe", "snoop", "snore", "snort",
            "snout", "snowy", "snuck", "snuff", "snug", "soapy", "sober", "soggy", "solar", "solid",
            "solve", "sonar", "sonic", "sooth", "sooty", "sorry", "sound", "south", "sower", "space",
            "spade", "spank", "spare", "spark", "spasm", "spawn", "speak", "spear", "speck", "speed",
            "spell", "spelt", "spend", "spent", "sperm", "spice", "spicy", "spied", "spiel", "spike",
            "spiky", "spill", "spilt", "spine", "spiny", "spire", "spite", "splat", "split", "spoil",
            "spoke", "spoof", "spook", "spool", "spoon", "spore", "sport", "spout", "spray", "spree",
            "sprig", "spunk", "spurn", "spurt", "squad", "squat", "squib", "stack", "staff", "stage",
            "staid", "stain", "stair", "stake", "stale", "stalk", "stall", "stamp", "stand", "stank",
            "stare", "stark", "start", "stash", "state", "stave", "stead", "steak", "steal", "steam",
            "steed", "steel", "steep", "steer", "stein", "stern", "stick", "stiff", "still", "stilt",
            "sting", "stink", "stint", "stock", "stoic", "stoke", "stole", "stomp", "stone", "stony",
            "stood", "stool", "stoop", "store", "stork", "storm", "story", "stout", "stove", "strap",
            "straw", "stray", "strip", "strut", "stuck", "study", "stuff", "stump", "stung", "stunk",
            "stunt", "style", "suave", "sugar", "suing", "suite", "sulky", "sully", "sumac", "sunny",
            "super", "surer", "surge", "surly", "sushi", "swami", "swamp", "swank", "swarm", "swash",
            "swath", "swear", "sweat", "sweep", "sweet", "swell", "swept", "swift", "swill", "swine",
            "swing", "swirl", "swish", "swiss", "swoon", "swoop", "sword", "swore", "sworn", "swung",
            "synod", "syrup", "tabby", "table", "taboo", "tacit", "tacky", "taffy", "taint", "taken",
            "taker", "tally", "talon", "tamer", "tango", "tangy", "taper", "tapir", "tardy", "tarot",
            "taste", "tasty", "tatty", "taunt", "tawny", "teach", "teary", "tease", "teddy", "teeth",
            "tempo", "tenet", "tenor", "tense", "tenth", "tepee", "tepid", "terra", "terse", "testy",
            "thank", "theft", "their", "theme", "there", "these", "theta", "thick", "thief", "thigh",
            "thing", "think", "third", "thong", "thorn", "those", "three", "threw", "throb", "throw",
            "thrum", "thumb", "thump", "thunk", "thyme", "tiara", "tibia", "tidal", "tiger", "tight",
            "tilde", "timer", "timid", "tinge", "tipsy", "titan", "tithe", "title", "toast", "today",
            "toddy", "token", "tonal", "tonga", "tonic", "tooth", "topaz", "topic", "torch", "torso",
            "torus", "total", "totem", "touch", "tough", "towel", "tower", "toxic", "toxin", "trace",
            "track", "tract", "trade", "trail", "train", "trait", "tramp", "trash", "trawl", "tread",
            "treat", "trend", "triad", "trial", "tribe", "trice", "trick", "tried", "tripe", "trite",
            "troll", "troop", "trope", "trout", "trove", "truce", "truck", "truly", "trump", "trunk",
            "truss", "trust", "truth", "tryst", "tubal", "tuber", "tulip", "tulle", "tumor", "tunic",
            "turbo", "tutor", "twang", "tweak", "tweed", "tweet", "twice", "twine", "twirl", "twist",
            "twits", "tying", "typal", "ulcer", "ultra", "umbra", "uncle", "uncut", "under", "undid",
            "undue", "unfed", "unfit", "unify", "union", "unite", "unity", "unlit", "unmet", "unset",
            "untie", "until", "unwed", "unzip", "upend", "upper", "upset", "urban", "urine", "usage",
            "usher", "using", "usual", "usurp", "utile", "utter", "vague", "valet", "valid", "valor",
            "value", "valve", "vapid", "vapor", "vault", "vaunt", "vegan", "vein", "venal", "venom",
            "venue", "verge", "verse", "verso", "verve", "vicar", "video", "vigil", "vigor", "villa",
            "vinyl", "viola", "viper", "viral", "virus", "visit", "visor", "vista", "vital", "vivid",
            "vixen", "vocal", "vodka", "vogue", "voice", "voila", "vomit", "voter", "vouch", "vowel",
            "wacky", "wafer", "wager", "wagon", "waist", "waive", "waltz", "warty", "waste", "watch",
            "water", "wavy", "waxen", "weary", "weave", "wedge", "weedy", "weigh", "weird", "welch",
            "welsh", "wench", "whack", "whale", "wharf", "wheat", "wheel", "whelp", "where", "which",
            "whiff", "while", "whine", "whiny", "whirl", "whisk", "whist", "white", "whole", "whoop",
            "whose", "widen", "wider", "widow", "width", "wield", "wight", "willy", "wimpy", "wince",
            "winch", "windy", "wine", "wing", "wink", "winny", "wiped", "wiper", "wired", "wiry",
            "wisdom", "wise", "wish", "wispy", "witty", "wizen", "woken", "woman", "women", "woody",
            "wooer", "wooly", "woozy", "wordy", "world", "worry", "worse", "worst", "worth", "would",
            "wound", "woven", "wrack", "wrath", "wreak", "wreck", "wrest", "wring", "wrist", "write",
            "writ", "wrong", "wrote", "wrung", "wryly", "yacht", "yahoo", "yearn", "yeast", "yield",
            "young", "youth", "zebra", "zesty", "zilch", "zippy", "zonal", "zoned", "zones", "zooms"
        };
        
        for (String word : fallbackWords) {
            words.add(word);
            vocab.add(word);
        }
    }

    public WordleResponse solve(String word, String hints) {
        try {
            if (word == null || word.length() != 5) {
                return new WordleResponse(null, "Word must be exactly 5 letters", false);
            }

            if (hints == null || hints.split(" ").length != 5) {
                return new WordleResponse(null, "Hints must be in format: 'x x x x x' (5 characters with spaces)", false);
            }

            // Reset state for new solve
            resetState();
            
            // Parse hints
            String[] hintArray = hints.split(" ");
            for (int i = 0; i < 5; i++) {
                char letter = word.charAt(i);
                char hint = hintArray[i].charAt(0);
                
                if (hint == '-') {
                    ban.add(letter);
                    unsure[i].add(letter);
                } else if (hint == 'x') {
                    contain.add(letter);
                    unsure[i].add(letter);
                } else {
                    sure.put(i, letter);
                }
            }
            
            // Apply your original filtering algorithm
            List<String> filteredWords = applyOriginalAlgorithm(word);
            
            // Get suggestions using your original best() method
            List<String> suggestions = getSuggestions(filteredWords);
            
            if (suggestions.isEmpty()) {
                return new WordleResponse(filteredWords, "No optimal suggestions found. Here are remaining words: " + filteredWords.size(), false);
            }

            return new WordleResponse(suggestions, "Found " + suggestions.size() + " optimal suggestions using your original algorithm", true);
            
        } catch (Exception e) {
            return new WordleResponse(null, "Error processing request: " + e.getMessage(), false);
        }
    }
    
    private void resetState() {
        ban.clear();
        contain.clear();
        sure.clear();
        for (int i = 0; i < LEN; i++) {
            unsure[i].clear();
        }
        delima = false;
        // Reset words to original vocab
        words = new ArrayList<>(vocab);
    }
    
    private List<String> applyOriginalAlgorithm(String word) {
        List<String> currentWords = new ArrayList<>(words);
        
        // Apply green letter filtering (your original logic)
        for (Integer index : sure.keySet()) {
            if (contain.indexOf(sure.get(index)) == -1) {
                contain.add(sure.get(index));
            }
            for (int i = 0; i < currentWords.size(); i++) {
                if (currentWords.get(i).charAt(index) != sure.get(index)) {
                    currentWords.remove(i);
                    i--;
                }
            }
        }
        
        // Apply yellow letter filtering (your original logic)
        for (int i = 0; i < contain.size(); i++) {
            for (int j = 0; j < ban.size(); j++) {
                if (ban.get(j) == contain.get(i)) {
                    ban.remove(j);
                    j--;
                }
            }
            for (int j = 0; j < currentWords.size(); j++) {
                if (currentWords.get(j).indexOf(contain.get(i)) == -1) {
                    currentWords.remove(j);
                    j--;
                }
            }
            for (int j = 0; j < currentWords.size(); j++) {
                if (currentWords.get(j).indexOf(contain.get(i)) == word.indexOf(contain.get(i)) && !sure.containsValue(contain.get(i))) {
                    currentWords.remove(j);
                    j--;
                }
            }
        }
        
        // Apply grey letter filtering (your original logic)
        for (int i = 0; i < ban.size(); i++) {
            for (int j = 0; j < currentWords.size(); j++) {
                if (currentWords.get(j).indexOf(ban.get(i)) != -1) {
                    currentWords.remove(j);
                    j--;
                }
            }
        }
        
        // Apply position-based filtering (your original logic)
        for (int i = 0; i < unsure.length; i++) {
            for (int k = 0; k < unsure[i].size(); k++) {
                for (int j = 0; j < currentWords.size(); j++) {
                    if (currentWords.get(j).charAt(i) == unsure[i].get(k)) {
                        currentWords.remove(j);
                        j--;
                    }
                }
            }
        }
        
        // Set delima flag (your original logic)
        if (sure.size() >= 2) {
            delima = true;
        }
        
        return currentWords;
    }
    
    private List<String> getSuggestions(List<String> remainingWords) {
        if (delima && remainingWords.size() >= 3) {
            return best(vocab, remainingWords);
        }
        return remainingWords.stream().limit(10).collect(Collectors.toList());
    }
    
    // Your original best() method adapted
    private List<String> best(List<String> listOfWords, List<String> remainingWords) {
        List<String> returnList = new ArrayList<>();
        List<Character> commonLetters = mostCommonLetters(remainingWords);
        
        for (String word : listOfWords) {
            if (containLetter(word, commonLetters) && isBest(word)) {
                returnList.add(word);
            }
        }
        
        return returnList.stream().limit(10).collect(Collectors.toList());
    }
    
    // Your original containLetter() method
    private boolean containLetter(String word, List<Character> list) {
        int count = 0;
        if (!single(word)) {
            return false;
        }
        
        for (int i = 0; i < word.length(); i++) {
            for (int j = 0; j < list.size(); j++) {
                if (word.charAt(i) == list.get(j)) {
                    count++;
                    break;
                }
            }
        }
        
        return count >= list.size();
    }
    
    // Your original single() method
    private boolean single(String word) {
        for (int i = 0; i < word.length() - 1; i++) {
            for (int j = i + 1; j < word.length(); j++) {
                if (word.charAt(i) == word.charAt(j)) {
                    return false;
                }
            }
        }
        return true;
    }
    
    // Your original isBest() method
    private boolean isBest(String word) {
        for (int i = 0; i < unsure.length; i++) {
            if (unsure[i].contains(word.charAt(i))) {
                return false;
            }
        }
        return true;
    }
    
    // Your original mostCommonLetters() method adapted
    private List<Character> mostCommonLetters(List<String> remainingWords) {
        List<Integer> unsureDigit = new ArrayList<>();
        List<Character> returnList = new ArrayList<>();
        Map<Character, Integer> letterCount = new HashMap<>();
        
        for (int i = 0; i < LEN; i++) {
            if (!sure.containsKey(i)) {
                unsureDigit.add(i);
            }
        }
        
        for (String word : remainingWords) {
            for (Integer digit : unsureDigit) {
                char letter = word.charAt(digit);
                letterCount.put(letter, letterCount.getOrDefault(letter, 0) + 1);
            }
        }
        
        // Sort by frequency and return top 3
        return letterCount.entrySet().stream()
                .sorted(Map.Entry.<Character, Integer>comparingByValue().reversed())
                .limit(3)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }
}
