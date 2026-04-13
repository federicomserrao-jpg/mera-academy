import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Limpiando datos anteriores...')
  await prisma.survey.deleteMany()
  await prisma.moduleLog.deleteMany()
  await prisma.completion.deleteMany()
  await prisma.moduleAssignment.deleteMany()
  await prisma.question.deleteMany()
  await prisma.module.deleteMany()
  await prisma.user.deleteMany()

  console.log('Creando usuarios...')

  const admin = await prisma.user.create({
    data: {
      id: '00000000-0000-0000-0000-000000000001',
      full_name: 'Administrador MERA',
      username: 'admin',
      password: 'admin123',
      campaign: 'General',
      role: 'adm',
    },
  })

  const supervisor = await prisma.user.create({
    data: {
      id: '00000000-0000-0000-0000-000000000002',
      full_name: 'Laura González',
      username: 'supervisor1',
      password: '1234',
      campaign: 'VISA',
      role: 'sup',
    },
  })

  // 7 colaboradores (los "7 candidatos con evaluaciones")
  const colaboradores = await Promise.all([
    prisma.user.create({
      data: {
        id: '00000000-0000-0000-0001-000000000001',
        full_name: 'Martín Rodríguez',
        username: 'mrodriguez',
        password: '1234',
        campaign: 'VISA',
        role: 'col',
        start_date: new Date('2026-04-01'),
      },
    }),
    prisma.user.create({
      data: {
        id: '00000000-0000-0000-0001-000000000002',
        full_name: 'Ana Fernández',
        username: 'afernandez',
        password: '1234',
        campaign: 'VISA',
        role: 'col',
        start_date: new Date('2026-04-02'),
      },
    }),
    prisma.user.create({
      data: {
        id: '00000000-0000-0000-0001-000000000003',
        full_name: 'Carlos Pérez',
        username: 'cperez',
        password: '1234',
        campaign: 'TLMK',
        role: 'col',
        start_date: new Date('2026-04-01'),
      },
    }),
    prisma.user.create({
      data: {
        id: '00000000-0000-0000-0001-000000000004',
        full_name: 'Sofía López',
        username: 'slopez',
        password: '1234',
        campaign: 'TLMK',
        role: 'col',
        start_date: new Date('2026-04-03'),
      },
    }),
    prisma.user.create({
      data: {
        id: '00000000-0000-0000-0001-000000000005',
        full_name: 'Diego Martínez',
        username: 'dmartinez',
        password: '1234',
        campaign: 'EDESUR',
        role: 'col',
        start_date: new Date('2026-04-02'),
      },
    }),
    prisma.user.create({
      data: {
        id: '00000000-0000-0000-0001-000000000006',
        full_name: 'Valentina García',
        username: 'vgarcia',
        password: '1234',
        campaign: 'FARMACITY',
        role: 'col',
        start_date: new Date('2026-04-04'),
      },
    }),
    prisma.user.create({
      data: {
        id: '00000000-0000-0000-0001-000000000007',
        full_name: 'Lucas Sánchez',
        username: 'lsanchez',
        password: '1234',
        campaign: 'ADT',
        role: 'col',
        start_date: new Date('2026-04-01'),
      },
    }),
  ])

  console.log('Creando módulos...')

  const modInduccion = await prisma.module.create({
    data: {
      id: '00000000-0000-0000-0002-000000000001',
      title: 'Inducción General',
      description: 'Módulo de bienvenida e introducción a MERA. Políticas, valores y procedimientos de la empresa.',
      campaign: 'General',
      sort_order: 1,
      days_limit: 3,
      max_attempts: 5,
      is_required: true,
    },
  })

  const modVisa = await prisma.module.create({
    data: {
      id: '00000000-0000-0000-0002-000000000002',
      title: 'Productos VISA - Nivel 1',
      description: 'Conocimiento básico de productos y servicios VISA. Tipos de tarjetas, beneficios y atención al cliente.',
      campaign: 'VISA',
      sort_order: 1,
      days_limit: 7,
      max_attempts: 3,
      is_required: true,
    },
  })

  const modTlmk = await prisma.module.create({
    data: {
      id: '00000000-0000-0000-0002-000000000003',
      title: 'Técnicas de Telemarketing',
      description: 'Estrategias de venta y atención telefónica. Manejo de objeciones y cierre de ventas.',
      campaign: 'TLMK',
      sort_order: 1,
      days_limit: 7,
      max_attempts: 3,
      is_required: true,
    },
  })

  console.log('Creando preguntas...')

  await prisma.question.createMany({
    data: [
      // Inducción General
      {
        id: '00000000-0000-0000-0003-000000000001',
        module_id: modInduccion.id,
        question_text: '¿Cuál es la puntuación mínima para aprobar un módulo?',
        type: 'multi',
        option_a: '50%',
        option_b: '60%',
        option_c: '70%',
        option_d: '80%',
        correct_option: 'b',
        explanation: 'La nota mínima de aprobación es 60% en todos los módulos.',
      },
      {
        id: '00000000-0000-0000-0003-000000000002',
        module_id: modInduccion.id,
        question_text: '¿Ante un problema con un cliente, cuál es el procedimiento correcto?',
        type: 'multi',
        option_a: 'Transferir sin aviso',
        option_b: 'Ignorar y esperar',
        option_c: 'Escuchar, buscar solución y escalar si es necesario',
        option_d: 'Colgar la llamada',
        correct_option: 'c',
        explanation: 'La atención al cliente requiere escucha activa y búsqueda de solución antes de escalar.',
      },
      {
        id: '00000000-0000-0000-0003-000000000003',
        module_id: modInduccion.id,
        question_text: '¿Los datos de los clientes pueden compartirse fuera de la empresa?',
        type: 'tf',
        option_a: 'Verdadero',
        option_b: 'Falso',
        correct_option: 'b',
        explanation: 'Los datos de clientes son confidenciales según las políticas de privacidad.',
      },
      // VISA
      {
        id: '00000000-0000-0000-0003-000000000004',
        module_id: modVisa.id,
        question_text: '¿Cuál es el plazo máximo para gestionar un reclamo VISA?',
        type: 'multi',
        option_a: '24 horas',
        option_b: '48 horas',
        option_c: '72 horas',
        option_d: '5 días hábiles',
        correct_option: 'd',
        explanation: 'Los reclamos VISA deben gestionarse en un máximo de 5 días hábiles.',
      },
      {
        id: '00000000-0000-0000-0003-000000000005',
        module_id: modVisa.id,
        question_text: '¿Una tarjeta VISA Débito puede usarse para compras internacionales?',
        type: 'tf',
        option_a: 'Verdadero',
        option_b: 'Falso',
        correct_option: 'a',
        explanation: 'Las tarjetas VISA Débito habilitadas pueden usarse internacionalmente, sujeto al banco emisor.',
      },
      // TLMK
      {
        id: '00000000-0000-0000-0003-000000000006',
        module_id: modTlmk.id,
        question_text: '¿Cuál es la técnica más efectiva para el cierre de una venta telefónica?',
        type: 'multi',
        option_a: 'Presionar al cliente con urgencia falsa',
        option_b: 'Resumir los beneficios y pedir una decisión concreta',
        option_c: 'Leer el script sin pausas',
        option_d: 'Extender la llamada lo más posible',
        correct_option: 'b',
        explanation: 'Resumir beneficios y guiar al cliente hacia una decisión concreta es la técnica más efectiva.',
      },
      {
        id: '00000000-0000-0000-0003-000000000007',
        module_id: modTlmk.id,
        question_text: '¿Se puede hacer una promesa de descuento no autorizada para cerrar una venta?',
        type: 'tf',
        option_a: 'Verdadero',
        option_b: 'Falso',
        correct_option: 'b',
        explanation: 'Solo se pueden ofrecer descuentos y beneficios que estén autorizados por la empresa.',
      },
    ],
  })

  console.log('Creando asignaciones y evaluaciones...')

  // Scores por colaborador: [induccion, campaña específica]
  const scores: Record<string, number[]> = {
    mrodriguez: [85, 72],
    afernandez: [90, 65],
    cperez: [75, 80],
    slopez: [60, 55],   // Sofía desaprueba TLMK
    dmartinez: [95],
    vgarcia: [70],
    lsanchez: [80],
  }

  for (const col of colaboradores) {
    const colScores = scores[col.username]

    // Asignación + completion de Inducción General (todos)
    await prisma.moduleAssignment.create({
      data: {
        user_id: col.id,
        module_id: modInduccion.id,
        assigned_by: admin.id,
      },
    })
    await prisma.completion.create({
      data: {
        user_id: col.id,
        module_id: modInduccion.id,
        score: colScores[0],
        passed: colScores[0] >= 60,
        created_at: new Date('2026-04-05'),
      },
    })

    // Módulo de campaña
    if (col.campaign === 'VISA' && colScores[1] !== undefined) {
      await prisma.moduleAssignment.create({
        data: {
          user_id: col.id,
          module_id: modVisa.id,
          assigned_by: supervisor.id,
        },
      })
      await prisma.completion.create({
        data: {
          user_id: col.id,
          module_id: modVisa.id,
          score: colScores[1],
          passed: colScores[1] >= 60,
          created_at: new Date('2026-04-08'),
        },
      })
    }

    if (col.campaign === 'TLMK' && colScores[1] !== undefined) {
      await prisma.moduleAssignment.create({
        data: {
          user_id: col.id,
          module_id: modTlmk.id,
          assigned_by: admin.id,
        },
      })
      await prisma.completion.create({
        data: {
          user_id: col.id,
          module_id: modTlmk.id,
          score: colScores[1],
          passed: colScores[1] >= 60,
          created_at: new Date('2026-04-09'),
        },
      })
    }
  }

  console.log('\n✓ Seed completado:')
  console.log(`  - 1 admin (admin / admin123)`)
  console.log(`  - 1 supervisor (supervisor1 / 1234)`)
  console.log(`  - 7 colaboradores (password: 1234)`)
  console.log(`  - 3 módulos con preguntas`)
  console.log(`  - Evaluaciones cargadas para los 7 colaboradores`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
