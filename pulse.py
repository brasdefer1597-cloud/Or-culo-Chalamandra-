import os
import requests


def disparar_alerta_trafico(llave, poas):
    """Envía alerta de masa crítica cuando cambia la llave o se resuelve Shor."""
    webhook_url = os.getenv('CHALAMANDRA_WEBHOOK_URL', 'TU_WEBHOOK_AQUI')

    if webhook_url == 'TU_WEBHOOK_AQUI':
        print('⚠️ Define CHALAMANDRA_WEBHOOK_URL para enviar alertas reales.')
        return

    payload = {
        'content': (
            '🦎 **ALERTA DE MASA CRÍTICA**\n'
            f'Nueva Llave Élite generada: `{llave}`\n'
            f'POAS Actual: `{poas}`\n'
            'Ventana de Decodificación: **60 MINUTOS**\n'
            'Acceso: https://chalamandra-magistral.vercel.app'
        )
    }

    response = requests.post(webhook_url, json=payload, timeout=10)
    response.raise_for_status()
    print('🚀 Trigger de tráfico enviado a las redes.')
