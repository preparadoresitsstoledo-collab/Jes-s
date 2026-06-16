<?php
/**
 * contacto.php — Recibe el formulario de contacto y envía un correo a
 * info@preparadoritsstoledo.es desde el propio servidor (Axarnet, PHP).
 * No requiere ninguna app por parte del visitante.
 */

header('Content-Type: application/json; charset=utf-8');

// Solo se acepta POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Método no permitido']);
    exit;
}

// Trampa antispam (honeypot): si viene relleno, es un bot. Fingimos éxito.
if (!empty($_POST['website'])) {
    echo json_encode(['ok' => true]);
    exit;
}

$nombre  = trim($_POST['nombre']  ?? '');
$email   = trim($_POST['email']   ?? '');
$mensaje = trim($_POST['mensaje'] ?? '');

// Validación básica
if ($nombre === '' || $mensaje === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Revisa los datos: nombre, email válido y mensaje.']);
    exit;
}

$destino = 'info@preparadoritsstoledo.es';

// Asunto (codificado para que se vean bien los acentos)
$asuntoTexto = 'Solicitud de información — ' . $nombre;
$asunto = '=?UTF-8?B?' . base64_encode($asuntoTexto) . '?=';

$cuerpo  = "Nuevo mensaje desde preparadoritsstoledo.es\n\n";
$cuerpo .= "Nombre: $nombre\n";
$cuerpo .= "Email: $email\n\n";
$cuerpo .= "Mensaje:\n$mensaje\n";

// Evitar inyección de cabeceras a través del email del remitente
$replyTo = preg_replace('/[\r\n]+/', ' ', $email);

$headers  = "From: Web preparadoritsstoledo.es <info@preparadoritsstoledo.es>\r\n";
$headers .= "Reply-To: $replyTo\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "MIME-Version: 1.0\r\n";

if (@mail($destino, $asunto, $cuerpo, $headers)) {
    echo json_encode(['ok' => true]);
} else {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'No se pudo enviar el mensaje. Inténtalo de nuevo más tarde.']);
}
