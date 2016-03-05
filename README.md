# ScoutBot

Scouting app for the 2016 FRC competition "Stronghold". :eyes:

## How to use
Get assigned a specific robot to focus on.
Choose either the `Pit` tab or `Game` tab at the top of the screen.
Fill in information as game goes along.
Tap the `Make QR code` button after the game ends.
On the master device, go to the `Decode` tab.
Tap the `Scan QR` button to input the QR code with the master device.

### Data files
To get the `gameData.csv` and `pitData.csv` files, go to **`\Android\data\io.github.twotau`** on either the master phone or USB connected computer.

Then, download it to a computer and use [Tableau](http://www.tableau.com/) to analyze the data.

## Pit scouting fields
All pit scout fields are checkboxes *except* the `Team number`.

* Team number
* Autonomous abilities
    * Defenses (can cross)
        * Portcullis
        * Cheval de Frise
        * Moat
        * Ramparts
        * Drawbridge
        * Sally port
        * Rock wall
        * Rough terrain
        * Low bar
    * Can reach defenses
    * Can grab ball
* Teleop abilities
    * Defenses (can cross)
        * Portcullis
        * Cheval de Frise
        * Moat
        * Ramparts
        * Drawbridge
        * Sally port
        * Rock wall
        * Rough terrain
        * Low bar
    * Shooting
        * Can shoot high
        * Can shoot low
        * Can grab ball
    * Roles
        * High shooting
        * Low shooting
        * Breaching
        * Defending

## Game scouting fields
* Team number
* Fouled (T / F)
* Dead bot (T / F)
* Chosen Defense (if they played against us)
  * Chosen Defense A (Portcullis / Cheval de Frise)
  * Chosen Defense B (Moat / Ramparts)
  * Chosen Defense C (Drawbridge / Sally port)
  * Chosen Defense D (Rock wall / Rough terrain)
* Autonomous mode
    * Autonomous Defense (names)
        * Auto Defense A (Portcullis / Cheval de Frise)
        * Auto Defense B (Moat / Ramparts)
        * Auto Defense C (Drawbridge / Sally port)
        * Auto Defense D (Rock wall / Rough terrain)
        * Auto Lowbar (T / F)
    * Auto Grabbed ball (T / F)
    * Auto High goal makes
    * Auto High goal misses
    * Auto Low goal makes
    * Auto Low goal misses
* Breached Defenses (teleop)
    * Breached Defense A
        * Breached Defense A name (Portcullis / Cheval de Frise)
        * Breached Defense A makes
        * Breached Defense A misses
    * Breached Defense B
        * Breached Defense B name (Moat / Ramparts)
        * Breached Defense B makes
        * Breached Defense B misses
    * Breached Defense C
        * Breached Defense C name (Drawbridge / Sally port)
        * Breached Defense C makes
        * Breached Defense C misses
    * Breached Defense D
        * Breached Defense D name (Rock wall / Rough terrain)
        * Breached Defense D makes
        * Breached Defense D misses
    * Breached Defense Lowbar (T / F)
* Teleop shooting
    * High goal makes
    * High goal misses
    * Low goal makes
    * Low goal misses
    * Times ball picked up
* Roles
    * High shooter (T / F)
    * Low shooter (T / F)
    * Breacher (T / F)
    * Defender (T / F)
* Scaling endgame
    * Tower NOT weakened (T / F)
    * Challenged Tower (T / F)
    * Scaled (T / F)

`Makes` are **successful** attempts and `Misses` are **unsuccessful** attempts.

## Screenshots

### Pit scouting

![Pit scouting 1](https://cloud.githubusercontent.com/assets/14433542/13544256/cf5e30c8-e228-11e5-8e32-8969faf911f4.png)

![Pit scouting 2](https://cloud.githubusercontent.com/assets/14433542/13544279/1ccb08b8-e229-11e5-93dd-5c77c530b47e.png)

![Pit scouting 3](https://cloud.githubusercontent.com/assets/14433542/13544307/4ba5d780-e229-11e5-98e4-5810d42e0211.png)

### Game scouting

![Game scouting 1](https://cloud.githubusercontent.com/assets/14433542/13544322/784a162a-e229-11e5-8426-81bdef687676.png)

![Game scouting 2](https://cloud.githubusercontent.com/assets/14433542/13544330/93bd4b20-e229-11e5-8eda-c73d38a7fb9e.png)

![Game scouting 3](https://cloud.githubusercontent.com/assets/14433542/13544345/aa24ac82-e229-11e5-84b7-b0fdb3166a66.png)

![Game scouting 4](https://cloud.githubusercontent.com/assets/14433542/13544354/c154135c-e229-11e5-97bd-3c15468a306b.png)

### Decoding

Prevents QR codes from being input twice into the data file.

![Sample error](https://cloud.githubusercontent.com/assets/14433542/13544370/fcc8b668-e229-11e5-85eb-5870e9dfecc0.png)
