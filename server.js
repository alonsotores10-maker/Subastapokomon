const WebSocket = require('ws');
const PORT = process.env.PORT || 8080;
const wss = new WebSocket.Server({ port: PORT });
const currentAuction = {
    type: 'Eléctrico',
    region: 'Kanto',
    regionalForm: false,
    trivia: 'Es la mascota oficial de la franquicia y genera electricidad desde sus mejillas.'
};

console.log(`Servidor WebSocket iniciado en el puerto ${PORT}`);

wss.on('connection', (ws) => {
    ws.send(JSON.stringify(currentAuction));
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            if (data.action === 'bid') {
                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({
                            type: currentAuction.type,
                            region: currentAuction.region,
                            regionalForm: currentAuction.regionalForm,
                            trivia: `¡Nueva puja más alta: P$ ${data.amount}!`
                        }));
                    }
                });
            }
        } catch (error) {
            console.error('Error al procesar mensaje:', error);
        }
    });
});
