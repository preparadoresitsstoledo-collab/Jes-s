/**
 * ============================================================================
 *  ASISTENTE DE DENUNCIA ANTE LA INSPECCIÓN DE TRABAJO Y SEGURIDAD SOCIAL.
 * ============================================================================
 *  Ayuda a personas no juristas a redactar una denuncia conforme al contenido
 *  mínimo del art. 20 de la Ley 23/2015 (identificación del denunciante y su
 *  firma, hechos con fecha y lugar, e identificación de los responsables).
 *
 *  Cada "hecho" se asocia a su MATERIA / clave de actuación inspectora y a un
 *  precepto orientativo, para coordinar el relato. ⚠️ Datos orientativos.
 * ============================================================================
 */

// Catálogo de hechos denunciables más habituales, agrupados por materia.
export const HECHOS = [
  {
    id: 'sin_alta',
    materia: 'Seguridad Social',
    clave: 'Alta / afiliación',
    label: 'Trabajar sin estar dado/a de alta en la Seguridad Social',
    texto:
      'Prestación de servicios sin figurar de alta en la Seguridad Social (falta de afiliación/alta).',
    precepto: 'Arts. 22.2 / 23.1.a) LISOS',
  },
  {
    id: 'sin_contrato',
    materia: 'Relaciones laborales',
    clave: 'Contratación',
    label: 'Trabajar sin contrato o con un contrato temporal en fraude',
    texto:
      'Prestación de servicios sin contrato formalizado o mediante contratación temporal en fraude de ley.',
    precepto: 'Arts. 7.1 y 7.2 LISOS',
  },
  {
    id: 'salarios',
    materia: 'Relaciones laborales',
    clave: 'Salarios',
    label: 'Impago o retraso reiterado del salario',
    texto: 'Impago o retraso continuado en el abono de los salarios devengados.',
    precepto: 'Arts. 7.10 / 8.1 LISOS',
  },
  {
    id: 'jornada',
    materia: 'Tiempo de trabajo',
    clave: 'Jornada',
    label: 'Exceso de jornada / horas extra no pagadas / sin registro de jornada',
    texto:
      'Realización de jornada superior a la legal o convencional, horas extraordinarias no abonadas ni compensadas y/o ausencia de registro diario de jornada.',
    precepto: 'Art. 7.5 LISOS (art. 34 ET)',
  },
  {
    id: 'prl',
    materia: 'Prevención de riesgos laborales',
    clave: 'PRL',
    label: 'Falta de medidas de seguridad y salud (PRL)',
    texto:
      'Incumplimiento de la normativa de prevención de riesgos laborales (falta de evaluación de riesgos, de medidas de protección, de formación o información, etc.).',
    precepto: 'Arts. 11, 12 y 13 LISOS (Ley 31/1995)',
  },
  {
    id: 'falso_autonomo',
    materia: 'Seguridad Social',
    clave: 'Encuadramiento',
    label: 'Falso autónomo (trabajo por cuenta ajena encubierto)',
    texto:
      'Prestación de servicios por cuenta ajena bajo la apariencia de trabajo autónomo (falso autónomo), con dependencia y ajenidad.',
    precepto: 'Arts. 22.2 / 23.1.a) LISOS',
  },
  {
    id: 'extranjeria',
    materia: 'Extranjería',
    clave: 'Trabajo de extranjeros',
    label: 'Empleo de personas extranjeras sin autorización',
    texto:
      'Ocupación de personas trabajadoras extranjeras sin la preceptiva autorización de residencia y/o trabajo.',
    precepto: 'Art. 37.1 LISOS / art. 54.1.d) LO 4/2000',
  },
  {
    id: 'desempleo',
    materia: 'Seguridad Social',
    clave: 'Prestaciones',
    label: 'Compatibilizar trabajo con prestación/subsidio (economía sumergida)',
    texto:
      'Compatibilización indebida del trabajo con el percibo de prestaciones o subsidios (por ejemplo, desempleo) y/o empleo no declarado.',
    precepto: 'Arts. 22.13 / 23.1.a) LISOS',
  },
  {
    id: 'discriminacion',
    materia: 'Derechos fundamentales',
    clave: 'Igualdad / acoso',
    label: 'Discriminación, acoso o vulneración de derechos',
    texto:
      'Trato discriminatorio, acoso o vulneración de derechos fundamentales en la relación laboral.',
    precepto: 'Arts. 8.12 y 8.13 bis LISOS',
  },
  {
    id: 'menores',
    materia: 'Relaciones laborales',
    clave: 'Trabajo de menores',
    label: 'Trabajo de menores de edad',
    texto: 'Empleo de menores en supuestos o condiciones prohibidos por la ley.',
    precepto: 'Art. 8.4 LISOS (art. 6 ET)',
  },
]

// Enlaces oficiales para presentar la denuncia.
export const ENLACES_OFICIALES = [
  {
    texto: 'Inspección de Trabajo y Seguridad Social — Denuncias (mites.gob.es)',
    url: 'https://www.mites.gob.es/itss/web/atencion_al_ciudadano/COMO_ACTUAR/Denuncias/index.html',
  },
  {
    texto: 'Sede electrónica del Ministerio de Trabajo y Economía Social',
    url: 'https://sede.mites.gob.es/',
  },
]
