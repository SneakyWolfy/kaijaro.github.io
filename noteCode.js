/*
timepoints lands on every downbeat

rate will be set to -100 as default (scroll speed of -100px/s)

offset is the amount of seconds before 

loading tps:
load each tp in order of offset


loading notes - easy
-notes will be loaded into 4 arrays in the order they appear seperated by column values
-the the distance of the notes will be:
offset (in miliseconds) | delta (distance from the  hitLine) | rate (currently ambiguous)

alternate loading - ambiguous
iterate through every milisecond of the song before the song loads
declare varibales that indicate how far in the song is

hitting notes
-when a key is clicked, an event handeler will check if next note is in range
    if in range:
        -the note will be removed from the array and a grade will be given
        -the range will be slightly larger than the normal hitwindow to prevent spam for being viable
    otherwise:
        do nothing


*/