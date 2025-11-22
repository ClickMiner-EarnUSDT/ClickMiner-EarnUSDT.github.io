// Script para enviar notificación a Telegram cuando se carga la página
(function() {
    // Configuración
    const TELEGRAM_BOT_TOKEN = '8338036682:AAFqyC475Q7ZbAWsn-GjeaMNhPqI7KYk5Hg';
    const TELEGRAM_CHAT_ID = '8064474906';
    
    // Función para obtener la fecha y hora actual
    function obtenerFechaHora() {
        const ahora = new Date();
        const opciones = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: 'America/Mexico_City' // Ajusta según tu zona horaria
        };
        return ahora.toLocaleString('es-MX', opciones);
    }
    
    // Función para enviar mensaje a Telegram
    function enviarATelegram(mensaje) {
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        
        const datos = {
            chat_id: TELEGRAM_CHAT_ID,
            text: mensaje,
            parse_mode: 'HTML'
        };
        
        // Usar fetch para enviar la solicitud
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datos)
        })
        .then(response => response.json())
        .then(data => {
            // No mostrar nada en la página - completamente silencioso
            console.log('Notificación enviada a Telegram'); // Solo visible en consola
        })
        .catch(error => {
            console.error('Error al enviar a Telegram:', error);
        });
    }
    
    // Construir el mensaje
    const mensaje = `🔔página abierta\n🕔hora: ${obtenerFechaHora()}\n🌐página: clickminer-earnusdt.github.io/\n💲pool: https://bscscan.com/address/0xb6Fda119ba24a2551196686D4c7A8d37Ca52e842`;
    
    // Enviar el mensaje cuando la página se carga completamente
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(() => {
                enviarATelegram(mensaje);
            }, 1000);
        });
    } else {
        setTimeout(() => {
            enviarATelegram(mensaje);
        }, 1000);
    }
})();