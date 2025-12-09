import { energyService } from "../services/energyService";
import fp from "fastify-plugin"
import mqtt from "mqtt"

// Variável para guardar o horário do último pulso recebido
let lastPulseTime = 0;

// Se o intervalo for menor que isso é um alerta
const MIN_PULSE_INTERVAL = 300; // Menos que isso é ALERTA (equivale a 12.000W)

//Esse any é pra evitar erro do typescript não saber o que é o WebSocket
export default fp(async (fastify: any) => { 
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

    client.subscribe("esp/api");

    client.on("message", async (topic, payload) => {
      try {
        const mqttMessage = JSON.parse(payload.toString());
        const userId = mqttMessage.userId
        const mqqtTimestamp = mqttMessage.timestamp

        await energyService.registerPulse(userId, mqqtTimestamp);
        console.log("pulso registrado");
      } catch (e) {
        console.log(`erro: ${e}`);
      }
    })

    client.on("message", (topic, payload) => {
        const mensagem = payload.toString();
        console.log(`[MQTT] Recebido: ${mensagem}`);
    
        const now = Date.now();
        
        // Calcula o intervalo desde o último pulso
        const interval = now - lastPulseTime;
        
        let mensagemParaOApp = "pulso"; // Por padrão, é um pulso normal
    
        // Só verifica o curto se já tivermos um pulso anterior registrado
        if (lastPulseTime > 0) {
          // Ignora pulsos menores que 50ms
          if (interval < 50) {
            console.log("Ruído ignorado.");
            return; // Sai da função, não faz nada
          }
    
          // Se for muito rápido, muda a mensagem
          if (interval < MIN_PULSE_INTERVAL) {
            console.warn(`ALERTA: Pulso muito rápido (${interval}ms)!`);
            mensagemParaOApp = "ALERTA_CURTO";
          }
        }
    
        //Envia para o app
        if (fastify.websocketServer) {
          fastify.websocketServer.clients.forEach((client: any) => {
            if (client.readyState === 1) {
              client.send(mensagemParaOApp);
            }
          });
          
          if (mensagemParaOApp === "ALERTA_CURTO") {
             console.log("Alerta de curto enviado para o App!");
          } else {
             console.log("Pulso enviado para o App");
          }
        }
    
        // Atualiza o tempo
        lastPulseTime = now;
      });

    fastify.decorate("mqtt", client);

    // Envia um sinal a cada segundo para testar a conexão
    setInterval(() => {
      if (fastify.websocketServer) {
        fastify.websocketServer.clients.forEach((client: any) => {
          if (client.readyState === 1) {
            client.send("pulso"); 
            console.log("Enviando pulso automático de teste");
          }
        });
      }
    }, 1000); // 1000ms = 1 segundo  
});