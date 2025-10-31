=== start ===
You find yourself in a neon-lit bar. The music is loud, and the crowd is restless.

A figure approaches you from the shadows.

Stranger: "New around here?"

* [Yeah, just arrived.]
  -> friendly_response
* [That's none of your business.]
  -> hostile_response
* [Who's asking?]
  -> neutral_response

=== friendly_response ===
Stranger: "Welcome! Name's Alex. Let me show you around."

You've made a new friend. Alex gestures toward the bar.

Alex: "First drink's on me. What'll it be?"

* [Beer]
  -> beer_choice
* [Cocktail]
  -> cocktail_choice
* [Just water, thanks.]
  -> water_choice

=== hostile_response ===
The stranger backs away, hands raised.

Stranger: "Alright, alright. No need to be hostile. Just trying to be friendly."

They disappear back into the crowd. You're alone again.

-> END

=== neutral_response ===
Stranger: "Smart. I respect that. Name's Alex."

Alex extends a hand. You shake it cautiously.

Alex: "You look like someone who needs information. Lucky for you, I've got plenty."

* [What kind of information?]
  -> information_path
* [I'm good, thanks.]
  -> decline_path

=== beer_choice ===
Alex orders you a cold beer. You take a sip and survey the room.

-> END

=== cocktail_choice ===
Alex orders an elaborate cocktail. The bartender lights it on fire before handing it over.

-> END

=== water_choice ===
Alex raises an eyebrow but orders you water anyway.

Alex: "Staying sharp, huh? Smart move."

-> END

=== information_path ===
Alex leans in close.

Alex: "This place isn't what it seems. Stick with me, and I'll show you the truth."

-> END

=== decline_path ===
Alex shrugs and walks away. You're back on your own.

-> END
