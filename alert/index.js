// Configuración
const config = {
  bscscanApiKey: 'RNUHCB42MKJWVHDFBWFMU4HJI8N4BRWQID',
  telegramBotToken: '8338036682:AAFqyC475Q7ZbAWsn-GjeaMNhPqI7KYk5Hg', // Reemplaza con tu token de bot de Telegram
  telegramChatId: '8064474906',    // Reemplaza con tu ID de chat de Telegram
  walletAddress: '0xb6Fda119ba24a2551196686D4c7A8d37Ca52e842',
  usdtContractAddress: '0x55d398326f99059fF775485246999027B3197955',
  checkInterval: 30000 // Verificar cada 30 segundos (ajusta según necesites)
};

// Variables de estado
let currentBalance = 0;
let lastCheckedBalance = 0;
let pageOpenedTime = new Date();

// Función para formatear el número de USDT (18 decimales)
function formatUSDT(balance) {
  return (balance / 1e18).toFixed(2);
}

// Función para obtener el saldo actual de USDT
async function getUSDTBalance() {
  try {
    const response = await fetch(`https://api.bscscan.com/api?module=account&action=tokenbalance&contractaddress=${config.usdtContractAddress}&address=${config.walletAddress}&tag=latest&apikey=${config.bscscanApiKey}`);
    const data = await response.json();
    
    if (data.status === '1') {
      return parseInt(data.result);
    } else {
      console.error('Error al obtener el saldo:', data.message);
      return null;
    }
  } catch (error) {
    console.error('Error en la solicitud:', error);
    return null;
  }
}

// Función para enviar mensaje a Telegram
async function sendTelegramMessage(message) {
  try {
    const url = `https://api.telegram.org/bot${config.telegramBotToken}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: config.telegramChatId,
        text: message,
        parse_mode: 'HTML'
      })
    });
    
    const data = await response.json();
    if (!data.ok) {
      console.error('Error:', data.description);
    }
  } catch (error) {
    console.error('Error', error);
  }
}

// Función para verificar nuevos depósitos
async function checkForNewDeposits() {
  const balance = await getUSDTBalance();
  if (balance === null) return;

  if (currentBalance === 0) {
    // Primera verificación
    currentBalance = balance;
    lastCheckedBalance = balance;
    return;
  }

  if (balance > lastCheckedBalance) {
    // Se detectó un nuevo depósito
    const amount = balance - lastCheckedBalance;
    const formattedAmount = formatUSDT(amount);
    const formattedTotal = formatUSDT(balance);
    
    // Obtener la última transacción (simplificado - en realidad necesitarías la API de transacciones)
    // Esto es un placeholder - necesitarías implementar la API de transacciones para obtener el TxID real
    const txId = '0x...'; // Deberías obtener esto de la API de transacciones
    
    const depositMessage = `
💰<b>𝐫𝐞𝐬𝐞𝐢𝐯𝐞 𝐮𝐬𝐝𝐭.</b>
_______________
|💎<b>𝐚𝐦𝐨𝐮𝐧𝐭:</b> ${formattedAmount} USDT
|🌑<b>𝐭𝐨𝐭𝐚𝐥:</b> ${formattedTotal} USDT
|📩<b>𝐓𝐱𝐈𝐃:</b> ${txId}
_______________
♻️𝒔𝒆𝒓𝒗𝒆𝒓 𝒊𝒔 𝒓𝒖𝒏𝒏𝒊𝒏𝒈...
    `;
    
    await sendTelegramMessage(depositMessage);
    
    // Actualizar el saldo verificado
    lastCheckedBalance = balance;
  } else if (balance < lastCheckedBalance) {
    // Se detectó una retirada (actualizar el saldo)
    lastCheckedBalance = balance;
  }
  
  currentBalance = balance;
}

// Función para enviar el mensaje inicial cuando se abre la página
async function sendInitialMessage() {
  const balance = await getUSDTBalance();
  if (balance === null) return;
  
  currentBalance = balance;
  lastCheckedBalance = balance;
  
  const formattedBalance = formatUSDT(balance);
  const formattedTime = pageOpenedTime.toLocaleTimeString();
  
  const initialMessage = `
👁️‍🗨️<b>𝐩𝐚́𝐠𝐢𝐧𝐚 𝐚𝐛𝐢𝐞𝐫𝐭𝐚.</b>
___________________
|♥️<b>𝐩𝐚́𝐠𝐢𝐧𝐚:</b> usdtminnerproff.github.io
|⌚<b>𝐡𝐨𝐫𝐚:</b> ${formattedTime}
|🤷‍♀️<b>𝐭𝐞𝐦𝐚:</b> inversiónes.
|💸<b>𝐮𝐬𝐝𝐭 𝐭𝐨𝐭𝐚𝐥:</b> ${formattedBalance} USDT
|👛<b>𝐰𝐚𝐥𝐥𝐞𝐭:</b> ${config.walletAddress}
___________________
♻️𝙢𝙞𝙣𝙖𝙣𝙙𝙤 𝙪𝙨𝙙𝙩...
  `;
  
  await sendTelegramMessage(initialMessage);
}

// Iniciar el monitoreo
function startMonitoring() {
  // Enviar mensaje inicial
  sendInitialMessage();
  
  // Configurar verificación periódica
  setInterval(checkForNewDeposits, config.checkInterval);
}

// Iniciar cuando la página se cargue
window.addEventListener('DOMContentLoaded', startMonitoring);