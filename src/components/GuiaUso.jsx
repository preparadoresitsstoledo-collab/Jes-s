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
          Si te los dan en un <strong>ZIP</strong>, descomprímelo antes. Puedes cargar la carpeta entera: se leen
          también las subcarpetas.
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
          tiempo trabajado para otra, art. 10 bis.2 RD 1561/1995).
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
      <ComoConseguirArchivos />
      <Bloque titulo="Qué documentos conviene reunir">
        <ul>
          <li>Nóminas del periodo (para los días e importes de las dietas y comprobar si se pagan horas extra).</li>
          <li>Contrato de trabajo y categoría profesional; fecha de antigüedad.</li>
          <li>Calendario o cuadrante de vacaciones, y bajas o permisos del periodo.</li>
          <li>Partes de trabajo, hojas de ruta o registros de jornada, si los hay.</li>
          <li>Descargas de la tarjeta de conductor.</li>
        </ul>
      </Bloque>
      <LimitesTacografo />
    </section>
  )
}
