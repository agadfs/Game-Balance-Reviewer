"use client";

import { useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";

export const MyContext = createContext();

export function MyContextProvider({ children }) {
  const [loggedData, setloggedData] = useState("");
  const [userGames, setUserGames] = useState([]);
  const [gameEntities, setGameEntities] = useState({}); // State to store entities per game
  const [isInitialized, setIsInitialized] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setloggedData(token);
      setIsInitialized(true); // Mark as initialized after setting token
    } else {
      router.push("/login");
    }
  }, []);

  useEffect(() => {
    // Fetch games only after initialization and when loggedData changes
    if (isInitialized && loggedData) {
      const fetchGames = async () => {
        const response = await fetch("/api/getUserGames", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: loggedData }),
        });

        const data = await response.json();

        setUserGames(data.games);

        // Fetch entities for each game
        data.games.forEach((game) => {
          fetchGameEntities(game.gameID);
        });
      };
      fetchGames();
    }
  }, [isInitialized, loggedData]); // Dependencies: run when these change

  const RTS_UNIT_ATTACK_calculateAttackStats = (log) => {
    const attackSummary = {};

    log.forEach((entry) => {
      const {
        attack_name,
        attack_damage,
        attack_speed_in_seconds,
        attack_type,
        attack_range,
        attack_range_unit,
        timestamp,
        attacker_stats,
      } = entry;

      const damage = parseFloat(attack_damage);
      const speed = parseFloat(attack_speed_in_seconds);
      const range = parseFloat(attack_range);

      // Initialize entry if it doesn't exist
      if (!attackSummary[attack_name]) {
        attackSummary[attack_name] = {
          attack_type,
          total_damage: 0,
          total_attacks: 0,
          total_time: 0,
          total_range: 0,
          attackers: new Set(),
          timestamps: [],
        };
      }

      // Update statistics
      attackSummary[attack_name].total_damage += damage;
      attackSummary[attack_name].total_attacks += 1;
      attackSummary[attack_name].total_time += speed;
      attackSummary[attack_name].total_range += range;
      attackSummary[attack_name].attackers.add(attacker_stats.name);
      attackSummary[attack_name].timestamps.push(timestamp);
    });

    // Convert to summary array
    const summaryArray = Object.keys(attackSummary).map((attackName) => {
      const summary = attackSummary[attackName];
      const uniqueTimestamps = [...new Set(summary.timestamps)];

      return {
        attack_name: attackName,
        attack_type: summary.attack_type,
        average_damage_per_second: (
          summary.total_damage / summary.total_time
        ).toFixed(2),
        average_range: (summary.total_range / summary.total_attacks).toFixed(2),
        units_that_used_attack: [...summary.attackers],
        total_attacks: summary.total_attacks,
        total_time: uniqueTimestamps.length * 2, // Assuming 2 seconds per unique timestamp
      };
    });

    return summaryArray;
  };

  const RTS_UNIT_BUILDING_calculateBuildProgress = (log) => {
    const buildSummary = {};

    log.forEach((entry) => {
      const {
        builder_name,
        builder_build_speed,
        building_name,
        building_cost,
        building_build_progress,
        timestamp,
      } = entry;

      const buildProgress = parseFloat(building_build_progress);
      const buildSpeed = parseFloat(builder_build_speed);

      // Initialize entry if it doesn't exist
      if (!buildSummary[building_name]) {
        buildSummary[building_name] = {
          builder_name,
          building_cost,
          total_progress: 0,
          build_speed: buildSpeed,
          timestamps: [],
          builders: new Set(),
          completion_time: 0,
        };
      }

      // Update statistics
      buildSummary[building_name].total_progress += buildProgress;
      buildSummary[building_name].builders.add(builder_name);
      buildSummary[building_name].timestamps.push(timestamp);

      // If building is completed, record completion time
      if (buildProgress >= 100) {
        buildSummary[building_name].completion_time =
          buildSummary[building_name].timestamps.length * 2; // Assuming each timestamp represents 2 seconds
      }
    });

    // Convert to summary array
    const summaryArray = Object.keys(buildSummary).map((buildingName) => {
      const summary = buildSummary[buildingName];
      const uniqueTimestamps = [...new Set(summary.timestamps)];

      return {
        building_name: buildingName,
        builder_name: [...summary.builders],
        building_cost: summary.building_cost,
        total_progress: summary.total_progress.toFixed(2),
        build_speed: summary.build_speed.toFixed(2),
        total_builders: summary.builders.size,
        completion_time: summary.completion_time,
        total_time: uniqueTimestamps.length * 2, // Assuming 2 seconds per unique timestamp
      };
    });

    return summaryArray;
  };
  const fetchGameEntities = async (gameID) => {
    const response = await fetch("/api/getUserGameEntities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameID }),
    });
  
    const entitiesData = await response.json();
    const logs = entitiesData.logs; // Assuming 'logs' is an array of log objects
  
    let converted_data = {};
  
    // Process each log individually
    logs.forEach(log => {
      const interface_Used = log.interface_Used;
  
      if (interface_Used === "RTS_UNIT_ATTACK") {
        const result = RTS_UNIT_ATTACK_calculateAttackStats(log.log);
        converted_data[interface_Used] = converted_data[interface_Used]
          ? converted_data[interface_Used].concat(result)
          : result;
      }
  
      if (interface_Used === "RTS_UNIT_BUILDING") {
        const result = RTS_UNIT_BUILDING_calculateBuildProgress(log.log);
        converted_data[interface_Used] = converted_data[interface_Used]
          ? converted_data[interface_Used].concat(result)
          : result;
      }
    });
  
    console.log(converted_data);
  
    setGameEntities((prevEntities) => ({
      ...prevEntities,
      [gameID]: {
        ...prevEntities[gameID],
        ...converted_data, // Spread the converted data to keep all types
      },
    }));
  };

  const changeLoginToken = (token) => {
    setloggedData(token);
    localStorage.setItem("token", token);
    setIsInitialized(true); // Mark as initialized if this is a new login
  };

  const logout = () => {
    setloggedData("");
    localStorage.removeItem("token");
    setIsInitialized(false); // Reset initialization state on logout
    setUserGames([]); // Clear user games on logout
    setGameEntities({}); // Clear entities on logout
  };

  return (
    <MyContext.Provider
      value={{
        userGames,
        gameEntities,
        loggedData,
        setloggedData,
        changeLoginToken,
        logout,
      }}
    >
      {children}
    </MyContext.Provider>
  );
}
