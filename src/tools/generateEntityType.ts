/* RTS */
/* 

Units

What unit is the most used for attacking? Why?
What unit is the less used? Why?
What unit is the most used for gathering resources? Why?

Buildings

What building is the most used? Why?
What building is the less used? Why?
What building is the most important? Why?

AI

Is the AI too difficult?
If so, does the AI makes to many actions per minute?
Does the AI makes the right actions?

MAP

Is the map too big or small?
Is the map good for any amount of players, they have enough near resources?



*/

export interface RTS_UNIT_ATTACK {
  timestamp: Date;
  attacker_stats: object;
  target_stats: object; 

  attack_name: string;
  attack_damage: string;
  attack_speed_in_seconds: string;
  attack_type: string;

  attack_range?: string;
  attack_range_unit?: string;
  projectile_speed?: string;
}

export interface RTS_UNIT_BUILDING {
  builder_name: string;
  builder_build_speed: string;
  timestamp: Date;

  building_name: string;

  building_cost: string;

  building_build_progress: string;
}

interface RTS_UNIT_GATHER_RESOURCE{
  gatherer_stats: string;
  resource_stats: string;
  gather_name: string;
  gather_speed: string;
}

/* FPS */
/*

Weapons

What weapon is the most used? Why?
What weapon is the less used? Why?


Maps
Is the map too big or small?
Is the map good forr both sides with enough spots for cover?

AI
Is AI accurate enough?
Does the AI makes the right actions?


*/



