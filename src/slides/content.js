const nextTree = [
  { label: 'src/' },
  { label: '  app/' },
  { label: '    layout.tsx' },
  { label: '    page.tsx' },
  { label: 'public/' },
  { label: 'next.config.ts' },
  { label: 'package.json' },
]

const payloadTree = [
  { label: 'src/' },
  { label: '  app/' },
  { label: '    (frontend)/', payload: true },
  { label: '    (payload)/admin/[[...segments]]/', payload: true },
  { label: '    (payload)/api/[...slug]/', payload: true },
  { label: '  collections/', payload: true },
  { label: '  payload.config.ts', payload: true },
  { label: '  payload-types.ts', payload: true },
  { label: 'public/' },
  { label: 'next.config.ts' },
  { label: 'package.json' },
]

export const slides = [
  {
    id: 1,
    type: 'title',
    title: 'PayloadCMS: Why Figma bought it',
    summary: 'Payload is the first CMS framework. Let me show you what that changes.',
    note: `Na początku zostawiam was z jednym pytaniem: dlaczego Figma, firma budująca narzędzia dla projektantów i developerów, kupiła CMS? Nie odpowiem na nie teraz. Zamiast opowiadać o checkboxach i tabelkach funkcji, zbudujemy małą aplikację konferencyjną. Po drodze zobaczycie, że Payload nie zachowuje się jak kolejny zewnętrzny headless CMS. Na końcu wrócimy do tego pytania i odpowiedź będzie już wynikała z kodu.`,
  },
  {
    id: 2,
    type: 'tree',
    kicker: 'STARTING POINT',
    title: 'It starts as a Next.js app.',
    tree: nextTree,
    note: `Zacznijmy od czegoś dobrze znanego. To jest zwykły projekt Next.js z App Routerem: layout, strona, public i konfiguracja. Nie ma jeszcze CMS-a, osobnego repozytorium ani klienta HTTP. Ten obraz jest ważny, bo za chwilę nie będziemy budować integracji z Payloadem. Dodamy Payload bezpośrednio do tej aplikacji.`,
  },
  {
    id: 3,
    type: 'tree',
    kicker: 'ONE REPOSITORY',
    title: 'Payload lives here.',
    tree: payloadTree,
    autoAnimate: 'project-tree',
    note: `Po instalacji nadal patrzymy na ten sam projekt Next.js. Pojawia się route group dla panelu administracyjnego i API, kolekcje, konfiguracja oraz wygenerowane typy. Frontend i Payload żyją obok siebie, używają tego samego TypeScriptu, procesu wdrożenia i runtime'u. To pierwsza duża różnica: Payload nie siedzi po drugiej stronie sieci. Jest częścią aplikacji.`,
  },
  {
    id: 4,
    type: 'code',
    kicker: 'COLLECTION',
    title: 'The backend starts with a config.',
    file: 'collections/Events.ts',
    autoAnimate: 'events-collection',
    codeSteps: [
      `export const Events: CollectionConfig = {
  slug: 'events',
  fields: [
    { name: 'title', type: 'text', required: true },
  ],
}`,
      `export const Events: CollectionConfig = {
  slug: 'events',
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'date', type: 'date', required: true },
    { name: 'status', type: 'select',
      options: ['draft', 'published'] },
  ],
}`,
    ],
    note: `Pierwszy element frameworka to kolekcja. To nie jest schema wyklikany w panelu dostawcy. To zwykły obiekt TypeScript, który mogę importować, składać z funkcji, testować i przeglądać w pull requeście. Zaczynam od tytułu, dokładam datę i status. Te kilka linii za moment stanie się bazą danych, API oraz interfejsem dla redaktora.`,
  },
  {
    id: 5,
    type: 'screenshot',
    kicker: 'CODE → UI',
    title: 'Add fields. Get a product.',
    image: '/screenshots/event-editor.png',
    imageAlt: 'Payload Admin event editor showing title, date, slug, and status fields',
    caption: 'Generated Admin UI / real local project',
    note: `To nie jest mockup. To panel uruchomiony z dokładnie tej kolekcji. Payload od razu zbudował formularz, walidację, listę dokumentów i operacje CRUD. Gdy zmieniam konfigurację, interfejs zmienia się razem z nią. Będę pilnował tego rytmu przez całą prezentację: najpierw pokażę kod, a potem faktyczny efekt w aplikacji.`,
  },
  {
    id: 6,
    type: 'code',
    kicker: 'GENERATED TYPES',
    title: 'The schema is executable.',
    file: 'payload-types.ts',
    autoAnimate: 'generated-types',
    codeSteps: [
      `$ pnpm generate:types

INFO  Compiling TS types...
INFO  Types written to payload-types.ts`,
      `export interface Event {
  id: number
  title: string
  date: string
  slug?: string | null
  status?: 'draft' | 'published' | null
}`,
    ],
    note: `Ta sama konfiguracja jest źródłem typów. Payload generuje interfejs Event, więc frontend, hooki i endpointy nie muszą ręcznie odtwarzać modelu danych. Gdy dodam pole lub zmienię jego opcje, kompilator pokaże wszystkie miejsca wymagające aktualizacji. Schema nie jest dokumentacją obok aplikacji. Jest wykonywalnym kontraktem aplikacji.`,
  },
  {
    id: 7,
    type: 'code',
    kicker: 'LOCAL API',
    title: 'No HTTP request required.',
    file: 'app/(frontend)/page.tsx',
    codeSteps: [
      `const payload = await getPayload({ config })

const { docs: events } = await payload.find({
  collection: 'events',
  where: { status: { equals: 'published' } },
  sort: 'date',
})

return <Schedule events={events} />`,
    ],
    note: `Jesteśmy w Server Componencie Next.js. Pobieram instancję Payload i wykonuję zapytanie przez Local API. Nie tworzę klienta REST, nie serializuję danych, nie konfiguruję CORS-u i nie utrzymuję drugiego deploymentu. Oczywiście REST i GraphQL nadal istnieją, kiedy są potrzebne. Ale wewnątrz tej samej aplikacji mogę ominąć niepotrzebną granicę HTTP.`,
  },
  {
    id: 8,
    type: 'screenshot',
    kicker: 'SERVER COMPONENT',
    title: 'The CMS and frontend ship together.',
    image: '/screenshots/event-listing.png',
    imageAlt: 'WarsawJS frontend listing an event loaded from Payload Local API',
    caption: 'Next.js frontend / Payload Local API',
    note: `A to wynik tamtego zapytania. Event utworzony w panelu pojawia się na stronie WarsawJS. Frontend może mieć dowolny design, bo Payload nie narzuca komponentów prezentacyjnych. Jednocześnie dane, typy i kod pobierający je są w jednym repozytorium. To jest dokładnie sposób pracy znany z frameworków aplikacyjnych, a nie klasyczna integracja z usługą CMS.`,
  },
  {
    id: 9,
    type: 'code',
    kicker: 'COLLECTION HOOK',
    title: 'Content has a lifecycle.',
    file: 'collections/Events.ts',
    codeSteps: [
      `hooks: {
  beforeChange: [
    ({ data }) => ({
      ...data,
      slug: data.slug || toSlug(data.title),
    }),
  ],
}`,
    ],
    note: `CMS framework musi obsługiwać zachowanie, nie tylko kształt danych. Hook beforeChange uruchamia naszą logikę przed zapisem dokumentu. Tutaj automatycznie generuje slug, ale w prawdziwej aplikacji może walidować reguły biznesowe, uruchamiać workflow albo przygotować dane do integracji. Hook otrzymuje request i instancję Payload, więc pozostaje wewnątrz tego samego cyklu operacji.`,
  },
  {
    id: 10,
    type: 'screenshot',
    kicker: 'HOOK RESULT',
    title: 'Behavior is visible.',
    image: '/screenshots/event-slug.png',
    imageAlt: 'Payload event editor showing a slug generated by a collection hook',
    caption: 'beforeChange → warsawjs-meetup-132',
    note: `Po zapisaniu eventu wartość pojawia się w dokumencie. Redaktor nie musi pamiętać reguły tworzenia adresów, a frontend zawsze dostaje spójne dane. Najważniejsze jest to, że zachowanie jest wersjonowanym kodem obok kolekcji. Możemy je zrecenzować, przetestować i zmienić razem z resztą aplikacji.`,
  },
  {
    id: 11,
    type: 'split',
    kicker: 'AUTH COLLECTION',
    title: 'Auth is part of the model.',
    file: 'collections/Users.ts',
    code: `export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  fields: [{
    name: 'role',
    type: 'select',
    options: ['admin', 'editor'],
  }],
}`,
    image: '/screenshots/admin-login.png',
    imageAlt: 'Payload Admin login screen',
    note: `W Payload uwierzytelnianie zaczyna się od kolekcji z auth: true. Dostajemy bezpieczne pola logowania, sesje, reset hasła i operacje auth, ale użytkownik nadal jest normalnym dokumentem, który możemy rozszerzyć. Dodaję rolę editor i admin bez podłączania osobnego systemu użytkowników. Ten sam model działa dla panelu oraz własnego frontendu.`,
  },
  {
    id: 12,
    type: 'code',
    kicker: 'ACCESS FUNCTION',
    title: 'Access is code.',
    file: 'access/eventAccess.ts',
    codeSteps: [
      `export const canUpdateEvents: Access = ({ req }) => {
  if (req.user?.role === 'admin') return true

  if (req.user?.role === 'editor') {
    return { status: { equals: 'draft' } }
  }

  return false
}`,
    ],
    note: `Autoryzacja nie jest macierzą checkboxów ukrytą w ustawieniach dostawcy. Funkcja access może zwrócić boolean albo zapytanie ograniczające konkretne rekordy. Administrator może aktualizować wszystko, editor tylko drafty, a anonimowy użytkownik nic. Ta reguła jest typowana i współdzielona przez powierzchnie Payload. Ważny detal: używając Local API w imieniu użytkownika ustawiam overrideAccess na false, bo operacje serwerowe domyślnie mają uprawnienia systemowe.`,
  },
  {
    id: 13,
    type: 'screenshot',
    kicker: 'ONE RULE / EVERY SURFACE',
    title: 'Permissions change the interface.',
    image: '/screenshots/restricted-editor.png',
    imageAlt: 'Payload Events list for an editor without the create button',
    caption: 'Editor session / create action removed',
    note: `Tutaj jestem zalogowany jako editor. Lista nadal pokazuje eventy, ale akcja tworzenia zniknęła, bo create jest dostępne wyłącznie dla admina. Te same funkcje access chronią REST, GraphQL i panel. Local API również może je respektować, gdy wyłączymy overrideAccess. Nie utrzymujemy osobnej logiki uprawnień dla każdego interfejsu.`,
  },
  {
    id: 14,
    type: 'split',
    kicker: 'CUSTOM ENDPOINT',
    title: 'The API is still yours.',
    file: 'collections/Events.ts',
    code: `{
  path: '/check-in', method: 'post',
  handler: async (req) => {
    if (!req.user) throw new APIError('Unauthorized', 401)
    const { eventID } = await req.json()

    return Response.json({
      ok: true, eventID, userID: req.user.id,
    })
  },
}`,
    image: '/screenshots/check-in-response.png',
    imageAlt: 'JSON response from the custom Payload check-in endpoint',
    note: `Payload generuje standardowe endpointy CRUD, ale aplikacja konferencyjna potrzebuje także check-inu. Dodaję własny endpoint bez wychodzenia z kolekcji Events. Mam dostęp do req.user, Payload API i tych samych typów. To nie jest plugin przyklejony do zamkniętego CMS-a. To normalny kod backendu działający wewnątrz frameworka. Po prawej widzicie prawdziwą odpowiedź lokalnego endpointu.`,
  },
  {
    id: 15,
    type: 'split',
    kicker: 'REACT ADMIN',
    title: 'The Admin is not a black box.',
    file: 'components/EventStatusCell.tsx',
    code: `export const EventStatusCell = ({ cellData }) => {
  const published = cellData === 'published'

  return (
    <span className={published ? 'live' : 'draft'}>
      ● {published ? 'Published' : 'Draft'}
    </span>
  )
}`,
    image: '/screenshots/status-cell.png',
    imageAlt: 'Payload Events list with a custom React status cell',
    note: `Panel administracyjny jest aplikacją React i ma punkty rozszerzeń. Tutaj podmieniam komórkę statusu własnym komponentem. Nie forkuję panelu i nie buduję osobnego backoffice'u tylko dlatego, że potrzebuję niestandardowego interfejsu. Mogę rozszerzać pola, widoki, dashboard i akcje dokładnie tam, gdzie wymaga tego produkt.`,
  },
  {
    id: 16,
    type: 'diagram',
    kicker: 'CMS FRAMEWORK',
    title: 'One schema. Six surfaces.',
    nodes: ['Database', 'Admin UI', 'Local API', 'REST / GraphQL', 'Types', 'Auth'],
    note: `Zatrzymajmy się i policzmy, co powstało z jednej konfiguracji. Mamy schemat bazy, panel, Local API, REST i GraphQL, wygenerowane typy oraz auth. Hooki, access i endpointy dokładają logikę aplikacyjną. Dlatego mówię o CMS frameworku. Payload daje spójne prymitywy do budowania produktu, a nie tylko miejsce do przechowywania treści.`,
  },
  {
    id: 17,
    type: 'ai',
    kicker: 'CODE-FIRST → AI-NATIVE',
    title: 'Agents can work with what they can read.',
    items: ['Schema', 'Hooks', 'Access', 'Endpoints', 'React', 'Types'],
    note: `Code-first ma dziś jeszcze jedną konsekwencję. Agent widzi schemat, hooki, reguły dostępu, endpointy, komponenty i typy w repozytorium. Może zaproponować zmianę, uruchomić kompilator i pokazać diff do review. To nie znaczy, że AI automatycznie napisze dobry system. Znaczy, że ma czytelny, wersjonowany kontekst oraz szybki feedback loop. Konfiguracja zamknięta wyłącznie w panelu dostawcy jest dla agenta znacznie mniej dostępna.`,
  },
  {
    id: 18,
    type: 'future',
    draft: true,
    kicker: 'EARLY LOOK / WORK IN PROGRESS',
    title: 'Payload 4.0',
    image: '/screenshots/payload-4-placeholder.svg',
    imageAlt: 'Placeholder for an official Payload 4.0 preview screenshot',
    items: ['Admin redesign', 'Hierarchies + DAM', 'MCP + Skills', 'TanStack adapter'],
    note: `To jest celowo wczesny draft, bo Payload 4.0 nadal się rozwija. Oficjalna zapowiedź pokazuje przebudowany Admin UI, hierarchie jako prymityw core, mocniejszy DAM, prostszy MCP i Payload Skills oraz adaptery frameworków z wczesnym wsparciem TanStack. Przed wystąpieniem podmienimy placeholder na aktualne oficjalne screenshoty i jeszcze raz zweryfikujemy status każdej funkcji.`,
  },
  {
    id: 19,
    type: 'conclusion',
    kicker: 'THE ANSWER',
    title: 'Payload turns content infrastructure into product code.',
    note: `Wracamy do pytania z pierwszego slajdu. Nie znam prywatnych powodów każdej decyzji akwizycyjnej Figmy, ale techniczny kierunek jest czytelny. Payload traktuje infrastrukturę treści tak, jak developerzy traktują produkt: kod, typy, React, wersjonowanie i pełna rozszerzalność. To naturalnie pasuje do firmy budującej platformę, w której design i development coraz mocniej się spotykają.`,
  },
  {
    id: 20,
    type: 'stats',
    draft: true,
    kicker: 'WHY LISTEN TO ME',
    title: 'I help build it.',
    stats: [
      ['3 years', 'in the ecosystem'],
      ['Contributor', 'Payload CMS'],
      ['X', 'pull requests opened'],
      ['X', 'issues solved / GitHub + Discord'],
    ],
    note: `Na koniec krótki kontekst, skąd biorą się te opinie. Od trzech lat pracuję w ekosystemie Payload i jestem kontrybutorem projektu. Używam go w aplikacjach, czytam kod źródłowy, otwieram pull requesty oraz pomagam rozwiązywać problemy na GitHubie i Discordzie. Konkretne liczby uzupełnię przed finalną wersją prezentacji.`,
  },
  {
    id: 21,
    type: 'quiz',
    draft: true,
    kicker: '5 MINUTES',
    title: 'Quick framework check.',
    questions: [
      'Which boundary disappears inside Next.js?',
      'Where is access control enforced?',
      'Why does code-first help AI agents?',
    ],
    note: `Quiz jest jeszcze draftem. Chcę użyć trzech krótkich pytań, które sprawdzają główne idee, a nie pamięć nazw API. Odpowiedzi będziemy odsłaniać progresywnie. Całość musi zamknąć się w pięciu minutach, dlatego pytania powinny prowokować szybkie głosowanie lub odpowiedź z sali, bez długiego omawiania.`,
  },
]
