/*
 * Base de recursos didáticos.
 * Cada item aponta para https://recursosdidaticos.senai.br/recurso-didatico/{id}
 *
 * ATENÇÃO: dados de EXEMPLO (MVP). Substituir pela lista oficial de recursos.
 * Mantido como .js (e não .json) para funcionar via file:// e dentro do pacote SCORM sem fetch.
 *
 * Campos:
 *   id      -> ID do recurso no RD tradicional (obrigatório)
 *   titulo  -> nome exibido
 *   curso   -> código + nome do curso
 *   uc      -> Unidade Curricular
 *   tipo    -> categoria (ver TIPOS em js/app.js)
 */
window.RD_RECURSOS = [
  { id: 19013, titulo: "Plano de ensino", curso: "CT-292 | Técnico em Desenvolvimento de Sistemas", uc: "Arquitetura de Rede com IoT", tipo: "plano-ensino" },
  { id: 19014, titulo: "Plano de aula ao vivo", curso: "CT-292 | Técnico em Desenvolvimento de Sistemas", uc: "Arquitetura de Rede com IoT", tipo: "plano-aula" },
  { id: 19015, titulo: "Situação de aprendizagem 1", curso: "CT-292 | Técnico em Desenvolvimento de Sistemas", uc: "Arquitetura de Rede com IoT", tipo: "situacao-aprendizagem" },
  { id: 19016, titulo: "Situação de aprendizagem 2", curso: "CT-292 | Técnico em Desenvolvimento de Sistemas", uc: "Arquitetura de Rede com IoT", tipo: "situacao-aprendizagem" },
  { id: 19017, titulo: "Arquivos-fonte (On_fontes)", curso: "CT-292 | Técnico em Desenvolvimento de Sistemas", uc: "Arquitetura de Rede com IoT", tipo: "fontes" },
  { id: 19018, titulo: "SCORM – SA1", curso: "CT-292 | Técnico em Desenvolvimento de Sistemas", uc: "Arquitetura de Rede com IoT", tipo: "scorm" },
  { id: 19019, titulo: "SCORM – SA2", curso: "CT-292 | Técnico em Desenvolvimento de Sistemas", uc: "Arquitetura de Rede com IoT", tipo: "scorm" },
  { id: 19020, titulo: "Livro digital", curso: "CT-292 | Técnico em Desenvolvimento de Sistemas", uc: "Internet das Coisas", tipo: "livro" },
  { id: 19021, titulo: "Arquivos-fonte (On_fontes)", curso: "CT-292 | Técnico em Desenvolvimento de Sistemas", uc: "Internet das Coisas", tipo: "fontes" },
  { id: 19022, titulo: "Plano de ensino", curso: "CT-292 | Técnico em Desenvolvimento de Sistemas", uc: "Internet das Coisas", tipo: "plano-ensino" },
  { id: 19023, titulo: "Situação de aprendizagem 1", curso: "CT-292 | Técnico em Desenvolvimento de Sistemas", uc: "Internet das Coisas", tipo: "situacao-aprendizagem" },
  { id: 19030, titulo: "Plano de ensino", curso: "CT-292 | Técnico em Desenvolvimento de Sistemas", uc: "Lógica de Programação", tipo: "plano-ensino" },
  { id: 19031, titulo: "Livro digital", curso: "CT-292 | Técnico em Desenvolvimento de Sistemas", uc: "Lógica de Programação", tipo: "livro" },
  { id: 19032, titulo: "Vídeo-aula: estruturas de repetição", curso: "CT-292 | Técnico em Desenvolvimento de Sistemas", uc: "Lógica de Programação", tipo: "video" },
  { id: 19033, titulo: "SCORM – SA1", curso: "CT-292 | Técnico em Desenvolvimento de Sistemas", uc: "Lógica de Programação", tipo: "scorm" },
  { id: 20101, titulo: "Plano de ensino", curso: "CT-310 | Técnico em Eletrotécnica", uc: "Instalações Elétricas Prediais", tipo: "plano-ensino" },
  { id: 20102, titulo: "Livro digital", curso: "CT-310 | Técnico em Eletrotécnica", uc: "Instalações Elétricas Prediais", tipo: "livro" },
  { id: 20103, titulo: "Situação de aprendizagem 1", curso: "CT-310 | Técnico em Eletrotécnica", uc: "Instalações Elétricas Prediais", tipo: "situacao-aprendizagem" },
  { id: 20104, titulo: "Vídeo: dimensionamento de condutores", curso: "CT-310 | Técnico em Eletrotécnica", uc: "Instalações Elétricas Prediais", tipo: "video" },
  { id: 20110, titulo: "Plano de ensino", curso: "CT-310 | Técnico em Eletrotécnica", uc: "Eletricidade Básica", tipo: "plano-ensino" },
  { id: 20111, titulo: "SCORM – Leis de Ohm e Kirchhoff", curso: "CT-310 | Técnico em Eletrotécnica", uc: "Eletricidade Básica", tipo: "scorm" },
  { id: 20112, titulo: "Plano de aula ao vivo", curso: "CT-310 | Técnico em Eletrotécnica", uc: "Eletricidade Básica", tipo: "plano-aula" }
];
