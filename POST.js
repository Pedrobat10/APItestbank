const axios = require('axios');
const qs = require('qs');

// Função para codificar o Client ID e o Client Secret em Base64
function getAuthorizationHeader(clientId, clientSecret) {
  const credentials = `${clientId}:${clientSecret}`;
  return Buffer.from(credentials).toString('base64');
}

// Função para validar os campos obrigatórios no contrato da API
function validateApiContract(responseData) {
  const requiredFields = ['access_token', 'token_type', 'expires_in', 'scope'];
  
  const missingFields = requiredFields.filter(field => !(field in responseData));
  
  if (missingFields.length > 0) {
    throw new Error(`Campos ausentes no contrato da API: ${missingFields.join(', ')}`);
  }
}

async function testOauthToken() {
  const url = 'https://api-homologacao.getnet.com.br/auth/oauth/v2/token';
  
  // Credenciais fornecidas
  const clientId = '67823c6d-58de-494f-96d9-86a4c22682cb';
  const clientSecret = 'c2d6a06f-5f31-448b-9079-7e170e8536e4';
  
  // Cabeçalhos da requisição
  const headers = {
    'Authorization': `Basic ${getAuthorizationHeader(clientId, clientSecret)}`,  // Autenticação básica
    'Content-Type': 'application/x-www-form-urlencoded'
  };
  
  // Dados da requisição
  const data = qs.stringify({
    'scope': 'oob',
    'grant_type': 'invalid_type'
  });

  try {
    // Fazer a requisição POST
    const response = await axios.post(url, data, { headers });
    
    // Validação do Status Code
    if (response.status !== 200) {
      throw new Error(`Status code inválido. Esperado: 200, Recebido: ${response.status}`);
    }
    
    // Validação do contrato da API
    validateApiContract(response.data);

    console.log('Teste de API bem-sucedido!');
    console.log('Token de acesso:', response.data.access_token);
  } catch (error) {
    if (error.response) {
      console.error(`Erro ${error.response.status}:`, error.response.data);
    } else {
      console.error('Erro ao testar a API:', error.message);
    }
  }
}

// Executar o teste da API
testOauthToken();
