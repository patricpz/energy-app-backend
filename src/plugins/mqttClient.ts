import fp from "fastify-plugin"
import mqtt from "mqtt"

export default fp(async (fastify) => {
    const client = mqtt.connect("mqtts://da2f337bc48244a6bdd7435ca715b00b.s1.eu.hivemq.cloud:8883", {
        username: "ESP32",
        password: "Esc@ravelh0",
        connectTimeout: 5000
    });

    client.on("connect", () => {
        console.log("MQTT conectado ao HiveMQ");
    })

    client.on("error", (err) => {
        console.log("Erro MQTT: ", err);
    })

    client.subscribe("foo/bar");

    client.on("message", (topic, payload) => {
        console.log("[MQTT]", topic, payload.toString());
    })

    fastify.decorate("mqtt", client);
});