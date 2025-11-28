/**
 * Integração com API ViaCEP para buscar dados de endereço pelo CEP
 * https://viacep.com.br
 */

export interface EnderecoViaCEP {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}

/**
 * Buscar endereço pelo CEP
 * @param cep CEP sem formatação (apenas números)
 * @returns Dados do endereço ou null se não encontrado
 */
export async function buscarEnderecoPorCEP(cep: string): Promise<EnderecoViaCEP | null> {
  try {
    // Remover formatação do CEP
    const cepLimpo = cep.replace(/\D/g, "");

    if (cepLimpo.length !== 8) {
      throw new Error("CEP deve conter 8 dígitos");
    }

    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);

    if (!response.ok) {
      throw new Error("Erro ao buscar CEP");
    }

    const data = await response.json();

    // ViaCEP retorna { erro: true } quando não encontra o CEP
    if (data.erro) {
      return null;
    }

    return data as EnderecoViaCEP;
  } catch (error) {
    console.error("[ViaCEP] Erro ao buscar endereço:", error);
    return null;
  }
}

/**
 * Formatar CEP para o padrão brasileiro (XXXXX-XXX)
 */
export function formatarCEP(cep: string): string {
  const cepLimpo = cep.replace(/\D/g, "");
  if (cepLimpo.length !== 8) return cep;
  return `${cepLimpo.slice(0, 5)}-${cepLimpo.slice(5)}`;
}

/**
 * Validar CEP
 */
export function validarCEP(cep: string): boolean {
  const cepLimpo = cep.replace(/\D/g, "");
  return cepLimpo.length === 8 && /^\d+$/.test(cepLimpo);
}
