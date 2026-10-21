// Guías de uso desplegables de las herramientas de transporte.

function Bloque({ titulo, children, abierto = false }) {
  return (
    <details className="guia__bloque" open={abierto}>
      <summary>{titulo}</summary>
      <div className="guia__contenido">{children}</div>
    </details>
  )
}

function ComoConseguirArchivos() {
  return (
    <Bloque titulo="¿Cómo consigo los archivos de mi tarjeta de conductor?">
      <ul>
        <li>
          <strong>Pídeselos a tu empresa.</strong> La empresa está obligada a descargar periódicamente los datos
          de tu tarjeta, a conservarlos y a facilitarte una copia si la solicitas (art. 33.2 del Reglamento (UE)
          165/2014). Pídelos por escrito y guarda copia de la petición.
        </li>
        <li>
          <strong>Descárgalos tú.</strong> Con un lector de tarjetas de tacógrafo (USB o de bolsillo) obtienes los
          archivos directamente de tu tarjeta. La tarjeta guarda aproximadamente el último mes de actividad, más o
          menos según el uso: descárgala con regularidad.
        </li>
        <li>
          Los archivos suelen terminar en <code>.DDD</code>, <code>.TGD</code>, <code>.C1B</code> o empezar por{' '}
          <code>C_</code>. Deben ser de la <strong>tarjeta del conductor</strong>; los del vehículo (empiezan por{' '}
          <code>V_</code> o <code>M_</code>) no sirven.
        </li>
        <li>
          La empresa debe llevar un <strong>registro del tiempo de trabajo</strong> de los trabajadores móviles,
          conservarlo y darte copia si la pides (art. 10 bis.5 RD 1561/1995). El RD fija una conservación de al menos
          3 años; el art. 34.9 ET, posterior y de rango superior, exige <strong>4 años</strong>.
        </li>
        <li>
          Si te los dan en un <strong>ZIP</strong>, descomprímelo antes. Puedes cargar la carpeta entera: se leen
          también las subcarpetas.
        </li>
      </ul>
    </Bloque>
  )
}

function AQuienSeAplica() {
  return (
    <Bloque titulo="¿A quién se aplica?">
      <ul>
        <li>
          A los <strong>trabajadores móviles del transporte por carretera</strong>: conductores, ayudantes y demás
          personal que viaja en el vehículo y trabaja con él, su carga o sus pasajeros (art. 10.2 RD 1561/1995).
        </li>
        <li>
          Los límites de conducción y descanso del Reglamento 561/2006 rigen en los vehículos de mercancías de más de
          3,5 t (desde el 1 de julio de 2026, también de más de 2,5 t en transporte internacional o cabotaje) y en los
          de viajeros de más de 9 plazas incluido el conductor, salvo las excepciones del propio Reglamento.
        </li>
        <li>
          Los <strong>autónomos</strong> tienen su propia norma (RD 128/2013) y no se les aplican las reglas de
          salario, horas extraordinarias ni cotización de la herramienta «Dietas y jornada».
        </li>
        <li>
          El transporte sanitario en <strong>ambulancia</strong> no se considera transporte por carretera a estos
          efectos según el Tribunal Supremo: allí no existe el tiempo de presencia como categoría propia.
        </li>
      </ul>
    </Bloque>
  )
}

function LimitesTacografo() {
  return (
    <Bloque titulo="Qué debes tener en cuenta al interpretar los resultados">
      <ul>
        <li>
          La <strong>conducción</strong> la registra el tacógrafo automáticamente; <strong>otros trabajos</strong>,{' '}
          <strong>disponibilidad</strong> y <strong>descanso</strong> dependen de que se marquen bien con el
          selector. Si la disponibilidad no se ha marcado, el tiempo de presencia saldrá a cero aunque haya existido.
        </li>
        <li>
          Los periodos con la <strong>tarjeta fuera del tacógrafo</strong> aparecen como «desconocidos». Por defecto
          se tratan como descanso, lo que favorece a la empresa; puedes cambiarlo en los parámetros.
        </li>
        <li>
          La tarjeta registra la actividad con <strong>todas las empresas</strong> para las que hayas conducido. Si
          has trabajado para varias, separa los periodos de cada una (el trabajador debe informar a cada empresa del
          tiempo trabajado para otra, que debe pedírselo por escrito, art. 10 bis.3 RD 1561/1995).
        </li>
        <li>
          Los límites de <strong>48 h semanales de promedio</strong> (en 4 meses, ampliable a 6 por convenio sectorial
          estatal) y de <strong>60 h en una semana</strong> se aplican cuando el convenio o un acuerdo con los
          representantes establece la distribución irregular de la jornada; en todo caso debe respetarse la jornada
          máxima del art. 34 ET (art. 10 bis.1 RD 1561/1995).
        </li>
        <li>
          <strong>Esperas de carga y descarga:</strong> las 2 primeras horas de cada espera son tiempo de presencia;
          desde la tercera son trabajo efectivo, salvo que su duración previsible se conociera de antemano en las
          condiciones del convenio (art. 10.4.c RD 1561/1995). El tacógrafo no sabe por qué se esperó: activa la
          opción de los parámetros solo si las esperas largas fueron de carga o descarga.
        </li>
        <li>
          <strong>Ferry o tren, esperas en frontera y prohibiciones de circular</strong> son presencia solo si la
          empresa comunicó antes de salir su existencia y duración previsible; si no lo hizo, son trabajo efectivo
          (art. 10.4.a y b). El tiempo del copiloto sentado o en la litera mientras conduce el otro es presencia
          (art. 10.4.d).
        </li>
        <li>
          La empresa debe informarte de la normativa, el convenio y los acuerdos que regulan tu tiempo de trabajo y
          tener un ejemplar a tu disposición (art. 10.6 RD 1561/1995).
        </li>
        <li>
          La <strong>presencia</strong> no cuenta para la jornada máxima ni para el límite de horas extraordinarias,
          pero debe pagarse, como mínimo, como hora ordinaria o compensarse con descanso retribuido; su límite de 20 h
          semanales se calcula de promedio en el mes (art. 8.3 RD 1561/1995), ampliable a 2 meses por convenio
          sectorial estatal (art. 10.5).
        </li>
        <li>
          <strong>Transporte internacional:</strong> si la tarjeta registra países, la herramienta indica los días en
          el extranjero y comprueba la excepción que permite dos descansos semanales reducidos seguidos fuera de
          España (art. 8.6 Reglamento 561/2006).
        </li>
        <li>
          Las <strong>jornadas</strong> se cuentan como en el Reglamento 561/2006 (de un descanso diario al
          siguiente), no por días naturales; por eso una jornada puede empezar un día y terminar al siguiente.
        </li>
        <li>
          Las incidencias marcadas como <strong>informativas</strong> (por ejemplo, descanso entre jornadas del
          Estatuto o del RD 1561/1995) deben valorarse: para los conductores sujetos al Reglamento 561/2006 rigen,
          en materia de descansos, los tiempos de ese Reglamento.
        </li>
      </ul>
    </Bloque>
  )
}

export function GuiaTacografo() {
  return (
    <section className="analizador__panel guia" aria-labelledby="guia-tacografo">
      <h2 id="guia-tacografo">📘 Cómo se usa</h2>
      <ol className="guia__pasos">
        <li>
          <strong>Carga los archivos</strong> de tu tarjeta de conductor: todos a la vez, aunque sean de varios años.
          Se unen y se quitan los días repetidos.
        </li>
        <li>
          <strong>Elige el conductor y el periodo</strong> que quieres analizar (por defecto, todo lo cargado).
        </li>
        <li>
          <strong>Revisa los parámetros</strong>: jornada anual del convenio, precio de la hora extraordinaria de cada
          año, franja nocturna…
        </li>
        <li>
          Pulsa <strong>«Analizar»</strong>: verás el resumen, el gráfico de cada día y las incidencias con el
          artículo incumplido.
        </li>
        <li>
          <strong>Descarga el Excel</strong> con el detalle diario, semanal, mensual y anual, y las horas
          extraordinarias que se pueden reclamar.
        </li>
      </ol>
      <AQuienSeAplica />
      <ComoConseguirArchivos />
      <LimitesTacografo />
    </section>
  )
}

export function GuiaDietasJornada() {
  return (
    <section className="analizador__panel guia" aria-labelledby="guia-dietas">
      <h2 id="guia-dietas">📘 Cómo se usa</h2>
      <p className="campo__ayuda">
        ¿Quieres verlo funcionando antes? Pulsa <strong>«Ver un ejemplo»</strong>: carga datos ficticios de dos
        conductores.
      </p>
      <ol className="guia__pasos">
        <li>
          <strong>Indica el periodo</strong> que quieres revisar y el <strong>convenio</strong>. Si es el de
          transporte de mercancías de Toledo, elígelo y se rellenan solos la jornada anual y los precios de la hora.
        </li>
        <li>
          <strong>Añade los datos de cada trabajador</strong>, de cualquiera de estas formas (se pueden combinar):
          <ul>
            <li>cargando los archivos del tacógrafo (días y horas de trabajo y presencia);</li>
            <li>pegando desde Excel las líneas de dietas de las nóminas (mes, tipo de dieta, días e importe);</li>
            <li>escribiendo directamente, para cada año, los días con dieta, las vacaciones disfrutadas o los días de baja.</li>
          </ul>
        </li>
        <li>
          Si la herramienta usa el convenio, indica en la ficha de cada trabajador su <strong>categoría</strong> y su{' '}
          <strong>antigüedad</strong> (bienios y quinquenios): cambian el precio de la hora.
        </li>
        <li>
          <strong>Marca las situaciones</strong> que conozcas (por ejemplo, que el importe de la dieta cambia sin
          motivo o que en las nóminas no aparecen horas extraordinarias).
        </li>
        <li>
          Revisa los <strong>resultados</strong> y descarga el <strong>informe</strong> (Word) y el{' '}
          <strong>Excel</strong>. Usa «Guardar datos» si quieres continuar otro día.
        </li>
      </ol>
      <Bloque titulo="Cómo se calculan los resultados">
        <ul>
          <li>
            <strong>Días de más:</strong> la jornada anual del convenio (por ejemplo, 1.800 h) se divide entre la
            jornada diaria (8 h) y da los días de trabajo máximos del año (225), en proporción si el periodo es menor.
            Se comparan con los días trabajados, que se deducen de los días con dieta y de los días con actividad
            en el tacógrafo.
          </li>
          <li>
            <strong>Horas extraordinarias con el tacógrafo:</strong> el trabajo efectivo (conducción y otros trabajos)
            que supera la jornada que correspondía en el periodo. El tiempo de presencia que la supera se paga como
            salario ordinario.
          </li>
          <li>
            <strong>Dietas:</strong> se revisa si su importe cambia sin motivo, si supera los límites exentos y cómo
            se compara con la dieta del convenio.
          </li>
          <li>
            <strong>Cantidades y cotizaciones:</strong> se valoran con el precio de la hora de cada año y los tipos de
            cotización, que puedes revisar y cambiar.
          </li>
          <li>
            <strong>Plazos:</strong> 1 año para reclamar salarios y 4 años para las cotizaciones, contados desde el fin
            del plazo de ingreso (el último día del mes siguiente al del salario).
          </li>
        </ul>
      </Bloque>
      <AQuienSeAplica />
      <ComoConseguirArchivos />
      <Bloque titulo="Qué documentos conviene reunir">
        <ul>
          <li>Nóminas del periodo (para los días e importes de las dietas y comprobar si se pagan horas extra).</li>
          <li>Contrato de trabajo y categoría profesional; fecha de antigüedad.</li>
          <li>Calendario o cuadrante de vacaciones, y bajas o permisos del periodo.</li>
          <li>Partes de trabajo, hojas de ruta o registros de jornada, si los hay.</li>
          <li>Descargas de la tarjeta de conductor y el registro de tiempo de trabajo de la empresa.</li>
          <li>
            Si se reclama, los registros del tacógrafo son una prueba importante; si la empresa no los aporta o no
            acredita haber pagado o compensado las horas, eso juega a favor del trabajador. Consulta a tu graduado
            social o abogado laboralista.
          </li>
        </ul>
      </Bloque>
      <LimitesTacografo />
    </section>
  )
}
