<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Solicitud de Quinquenio</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12pt;
            line-height: 1.3; /* Un poco más compacto */
            margin: 2cm; /* Reducido de 3cm a 2cm para ganar espacio superior */
            color: #000;
        }
        .text-right { text-align: right; }
        .text-justify { text-align: justify; }
        .text-center { text-align: center; }
        .uppercase { text-transform: uppercase; }
        
        /* Utilidades de espaciado */
        .mb-2 { margin-bottom: 1rem; }
        .mb-4 { margin-bottom: 2rem; }
        .mb-6 { margin-bottom: 3rem; }
        .mt-10 { margin-top: 4.5rem; } /* Espacio para que quepa la firma física */
        
        .firma-caja {
            width: 320px;
            margin: 0 auto;
            border-top: 1px solid #000;
            padding-top: 10px;
        }
    </style>
</head>
<body>

    <p class="text-right mb-4" style="margin-top:2;">
        La Paz, {{ $fecha }}
    </p>

    <div class="mb-4">
        <p>Señora:<br>
        Andrea Ponce Lemaitre<br>
        <strong>Jefe de RRHH</strong><br>
        Presente.-</p>
    </div>

    <p class="text-right mb-6">
        <strong>REF. SOLICITUD DE PAGO DE {{ $quinquenio }} QUINQUENIO</strong>
    </p>

    <p class="mb-2">
        De mi consideración:
    </p>

    <p class="text-justify mb-4">
        Por medio de la presente yo, <strong>{{ $nombre }}</strong> con C.I. <strong>{{ $ci }}</strong>, me dirijo a su persona con el debido respeto para solicitar el pago correspondiente a mi <strong>{{ $quinquenio }} QUINQUENIO</strong>, en atención al tiempo prestado en la institución.
    </p>

    <p class="text-justify mb-2">
        Esperando una respuesta favorable a mi solicitud.
    </p>

    <p class="mb-4">
        Sin otro particular, me despido.
    </p>

    <p style="margin-bottom: 0;"> Atentamente,
    </p>
    <p style="margin-bottom: 0;"> 
    </p>
    

    <div class="mt-10 text-center">
        <div class="firma-caja">
            <strong>C.I. {{ $ci }}</strong><br>
            {{ $nombre }}<br>
            {{ $cargo }}
        </div>
    </div>

</body>
</html>