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

    client.subscribe("foo/bar");

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
});