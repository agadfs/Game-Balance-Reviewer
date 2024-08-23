"use client";

import { MyContext } from "@/src/components/context/context";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const { userGames, gameEntities } = useContext(MyContext);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    
    if(userGames.length > 0 && gameEntities) {
      setLoading(false);
    }
  }, [userGames]);
  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <h1 style={{ fontSize: "3vw", fontWeight: "bold" }}>Loading...</h1>
      </div>
    );
  }
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div style={{ marginBottom: "5%" }}>
        <h1 style={{ fontSize: "3vw", fontWeight: "bold" }}>
          Welcome to your Game Library
        </h1>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          width: "100%",
        }}
      >
        {userGames?.map((game, indexGame) => (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "5%",
              borderBottom: "5px solid black",
              marginBottom: "5%",
              boxShadow: "5px 5px 5px black",
              width: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.1)",
              borderRadius: "10px",
            }}
            key={indexGame}
          >
            <h1>
              <span style={{ fontSize: "3vw", fontWeight: "bold" }}>
                {game.name}
              </span>
            </h1>
            <p>
              <span style={{ fontSize: "1.5vw", fontWeight: "bold" }}>
                GENRE:{" "}
              </span>
              {game.genre}
            </p>
            <p>
              <span style={{ fontSize: "1.5vw", fontWeight: "bold" }}>
                PLATFORM:{" "}
              </span>
              {game.platform}
            </p>
            <p>
              <span style={{ fontSize: "1.5vw", fontWeight: "bold" }}>
                Game Id:{" "}
              </span>
              {game.gameID}
            </p>
            <div
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.1)",
                borderRadius: "10px",
                padding: "1vw",
              }}
            >
              <h4 style={{ fontSize: "2.5vw", fontWeight: "bold" }}>
                Entities by Type
              </h4>
              <div style={{width:"100%", display:"flex", gap:"5vw"}} >
                {gameEntities[game.gameID] &&
                  Object.keys(gameEntities[game.gameID]).map(
                    (interfaceType, indexType) => (
                      <div  key={indexType}>
                        <h5
                          style={{
                            fontSize: "2vw",
                            fontWeight: "bold",
                            marginBottom: "1vw",
                          }}
                        >
                          {interfaceType}({gameEntities[game.gameID][interfaceType].length})
                        </h5>
                        {gameEntities[game.gameID][interfaceType].map(
                          (entity, indexEntity) => (
                            <div
                              style={{
                                backgroundColor: "rgba(0, 0, 0, 0.1)",
                                borderRadius: "10px",
                                padding: "1vw",
                                marginBlock: "2vw",
                               height: "50vh",
                              }}
                              key={indexEntity}
                            >
                              {interfaceType === "RTS_UNIT_ATTACK" && (
                                <>
                                  <p>
                                    <span
                                      style={{
                                        fontSize: "1.5vw",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      Attack Name:{" "}
                                    </span>
                                    {entity.attack_name}
                                  </p>
                                  <p>
                                    <span
                                      style={{
                                        fontSize: "1.5vw",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      Attack Type:{" "}
                                    </span>
                                    {entity.attack_type}
                                  </p>
                                  <p>
                                    <span
                                      style={{
                                        fontSize: "1.5vw",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      Average Damage Per Second:{" "}
                                    </span>
                                    {entity.average_damage_per_second}
                                  </p>
                                  <p>
                                    <span
                                      style={{
                                        fontSize: "1.5vw",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      Average Range:{" "}
                                    </span>
                                    {entity.average_range}{" "}
                                    {entity.attack_range_unit}
                                  </p>
                                  <p>
                                    <span
                                      style={{
                                        fontSize: "1.5vw",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      Units That Used Attack:{" "}
                                    </span>
                                    {entity.units_that_used_attack.join(", ")}
                                  </p>
                                  <p>
                                    <span
                                      style={{
                                        fontSize: "1.5vw",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      Total Attacks:{" "}
                                    </span>
                                    {entity.total_attacks}
                                  </p>
                                  <p>
                                    <span
                                      style={{
                                        fontSize: "1.5vw",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      Total Time:{" "}
                                    </span>
                                    {entity.total_time} seconds
                                  </p>
                                </>
                              )}
                              {interfaceType === "RTS_UNIT_BUILDING" && (
                                <>
                                  <p>
                                    <span
                                      style={{
                                        fontSize: "1.5vw",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      Building Name:{" "}
                                    </span>
                                    {entity.building_name}
                                  </p>
                                  <p>
                                    <span
                                      style={{
                                        fontSize: "1.5vw",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      Builders:{" "}
                                    </span>
                                    {entity.builder_name.join(", ")}
                                  </p>
                                  <p>
                                    <span
                                      style={{
                                        fontSize: "1.5vw",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      Building Cost:{" "}
                                    </span>
                                    {entity.building_cost}
                                  </p>
                                  <p>
                                    <span
                                      style={{
                                        fontSize: "1.5vw",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      Total Progress:{" "}
                                    </span>
                                    {entity.total_progress}%
                                  </p>
                                  <p>
                                    <span
                                      style={{
                                        fontSize: "1.5vw",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      Build Speed:{" "}
                                    </span>
                                    {entity.build_speed}
                                  </p>
                                  <p>
                                    <span
                                      style={{
                                        fontSize: "1.5vw",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      Total Builders:{" "}
                                    </span>
                                    {entity.total_builders}
                                  </p>
                                  <p>
                                    <span
                                      style={{
                                        fontSize: "1.5vw",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      Completion Time:{" "}
                                    </span>
                                    {entity.completion_time} seconds
                                  </p>
                                  <p>
                                    <span
                                      style={{
                                        fontSize: "1.5vw",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      Total Time:{" "}
                                    </span>
                                    {entity.total_time} seconds
                                  </p>
                                </>
                              )}
                              {/* Add more conditions for other interface types as needed */}
                            </div>
                          )
                        )}
                      </div>
                    )
                  )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
