const { createStrapi } = require('@strapi/strapi');
const path = require('node:path');
const assert = require('node:assert/strict');

process.env.STRAPI_TELEMETRY_DISABLED = 'true';
process.env.PORT = '0';
process.env.HOST = '127.0.0.1';
process.env.TRUST_NGINX_PROXY = 'false';

async function main() {
  if (process.env.NODE_ENV === 'production') throw new Error('Esta comprobación es solo local.');
  const root = path.resolve(__dirname, '..');
  const app = createStrapi({ appDir: root, distDir: root });
  try {
    await app.load();
    await app.listen();
    const origin = `http://127.0.0.1:${app.server.httpServer.address().port}`;
    process.env.MEDIA_PUBLIC_ORIGIN = origin;
    assert.equal((await fetch(`${origin}/api/home`)).status, 403, 'La API genérica no debe ser pública');
    assert.equal((await fetch(`${origin}/api/contact-setting`)).status, 404, 'Los destinatarios no tienen Content API');
    const response = await fetch(`${origin}/api/content/home`);
    assert.equal(response.status, 200, 'Ejecuta npm run seed si no hay Inicio publicado');
    for (const key of ['site', 'bank', 'programs', 'about', 'faq', 'donate', 'beneficiaries', 'sponsorship', 'sponsoredCases', 'contactPage', 'programsPage', 'partners', 'navigation']) {
      assert.equal((await fetch(`${origin}/api/content/${key}`)).status, 200, `Ejecuta npm run seed: falta ${key}`);
    }
    for (const generic of ['site', 'sites', 'bank-account', 'bank-accounts', 'programs', 'about-page', 'about-pages', 'faq-page', 'faq-pages', 'donate-page', 'donate-pages', 'sponsored-case', 'sponsored-cases', 'contact-page', 'programs-page', 'navigation', 'navigations']) {
      assert.equal((await fetch(`${origin}/api/${generic}`)).status, 404, `Sin Content API genérica: /api/${generic}`);
    }
    const drafts = await app.documents('api::program.program').findMany({ status: 'draft', fields: ['slug', 'publishedAt'] });
    const published = new Set((await app.documents('api::program.program').findMany({ status: 'published', fields: ['slug'] })).map((p) => p.slug));
    const draftOnly = drafts.filter((p) => !published.has(p.slug)).map((p) => p.slug);
    const { programs } = await (await fetch(`${origin}/api/content/programs`)).json();
    assert.ok(programs.length > 0, 'Ejecuta npm run seed: faltan programas');
    assert.equal(programs.some((p) => draftOnly.includes(p.slug)), false, 'Un borrador no debe aparecer en la web');
    // Casos de apadrinamiento: un borrador sin consentimiento no puede publicarse y no sale en la web.
    const caseUid = 'api::sponsored-case.sponsored-case';
    const unconsented = await app.documents(caseUid).findFirst({ status: 'draft', filters: { consent: false } });
    if (unconsented) {
      await assert.rejects(app.documents(caseUid).publish({ documentId: unconsented.documentId }), /consentimiento/, 'Sin consentimiento no se publica');
      const { cases } = await (await fetch(`${origin}/api/content/sponsoredCases`)).json();
      assert.equal(cases.some((item) => item.src.includes(unconsented.image?.hash ?? '__none__')), false);
    }
    // Páginas creadas desde el panel: slug reservado rechazado; una página publicada se lee por
    // /api/content/pages/:slug con el texto saneado; la API genérica no existe.
    const pageUid = 'api::page.page';
    await assert.rejects(app.documents(pageUid).create({ data: { title: 'Donar', slug: 'donar', body: [] } }), /ya lo usa/);
    const richText = (url) => [{ __component: 'blocks.rich-text', parts: [{ align: 'centro', body: [{ type: 'paragraph', children: [
      { type: 'link', url, children: [{ type: 'text', text: 'enlace' }] },
    ] }] }, { body: [{ type: 'paragraph', children: [{ type: 'text', text: 'Segunda sección' }] }] }] }];
    // Primera barrera: Strapi no guarda un enlace javascript: (la segunda es sanitizeRichText).
    await assert.rejects(app.documents(pageUid).create({ data: { title: 'X', slug: 'enlace-inseguro', body: richText('javascript:alert(1)') } }), /valid link/);
    const tempPage = await app.documents(pageUid).create({
      data: {
        title: 'Prueba de integración', slug: 'prueba-integracion-temporal',
        body: [
          ...richText('/donar'),
          // Bloques que reutilizan secciones del sitio y los nuevos.
          { __component: 'about.approach', heading: { lead: 'Pilares' }, pillars: [{ title: 'Pilar', items: [{ text: 'uno' }] }], quote: 'Cita' },
          { __component: 'home.process', steps: [{ title: 'Acopio', description: 'D', statSource: 'kilos' }] },
          { __component: 'blocks.partners' },
          { __component: 'about.intro', tabs: [{ title: 'Misión', items: [{ text: 'uno' }] }] },
          { __component: 'about.networks', types: [{ title: 'Red', items: [{ text: 'uno' }] }], joinSteps: [{ title: 'Paso', description: 'D' }] },
          { __component: 'about.coverage', municipalities: [{ name: 'Zamora', state: 'Michoacán', communities: 1, families: 1 }] },
          { __component: 'blocks.programs-detail', ctaTitle: 'Cierre' },
          { __component: 'blocks.social', heading: { lead: 'Síguenos' } },
          { __component: 'blocks.site-cta', note: 'interna' },
          { __component: 'blocks.donate', note: 'interna' },
          { __component: 'blocks.embed', kind: 'video', url: 'https://www.youtube.com/embed/abc123', title: 'Video' },
          { __component: 'blocks.embed', kind: 'video', url: 'https://evil.example/embed/abc', title: 'No permitido' },
        ],
      },
      status: 'published',
    });
    try {
      const pageResponse = await fetch(`${origin}/api/content/pages/prueba-integracion-temporal`);
      assert.equal(pageResponse.status, 200, 'La página publicada debe leerse');
      const pageContent = await pageResponse.json();
      // Caché: la página ya leída se sirve de memoria, y al editar y publicar se ve el cambio al instante.
      await app.documents(pageUid).update({ documentId: tempPage.documentId, data: { subtitle: 'Cambio visible al instante' } });
      await app.documents(pageUid).publish({ documentId: tempPage.documentId });
      const refreshed = await (await fetch(`${origin}/api/content/pages/prueba-integracion-temporal`)).json();
      assert.equal(refreshed.pageSubtitle, 'Cambio visible al instante', 'Publicar vacía la caché del contenido público');
      assert.deepEqual(pageContent.blocks[0].parts[0].body[0].children, [{ type: 'link', url: '/donar', children: [{ type: 'text', text: 'enlace' }] }]);
      assert.deepEqual(pageContent.blocks[0].parts.map((part) => part.align), ['centro', 'izquierda'], 'Cada sección de texto lleva su alineación');
      assert.deepEqual(pageContent.blocks.map((block) => block.type), ['rich-text', 'pillars', 'process', 'partners', 'tabs', 'join', 'coverage', 'programs-detail', 'social', 'site-cta', 'donate', 'embed'],
        'Los bloques salen en orden y el video de un origen no permitido no se publica');
      assert.equal(pageContent.blocks[1].pillars[0].items[0], 'uno');
      for (const slug of ['donar', 'no-existe-esta-pagina', '..%2Fadmin', 'Mayusculas']) {
        assert.equal((await fetch(`${origin}/api/content/pages/${slug}`)).status, 404, `Página inexistente o prohibida: ${slug}`);
      }
      for (const generic of ['pages', 'page']) {
        assert.equal((await fetch(`${origin}/api/${generic}`)).status, 404, `Sin Content API genérica: /api/${generic}`);
      }
      // Vista previa: un borrador solo se lee con el permiso firmado de ese mismo documento.
      const { createPreview } = require('../src/lib/preview');
      const signer = createPreview({ secret: app.config.get('admin.auth.secret') });
      const draftPage = await app.documents(pageUid).create({ data: { title: 'Borrador de prueba', slug: 'borrador-integracion-temporal', body: richText('/donar') } });
      try {
        const draftUrl = `${origin}/api/content/pages/borrador-integracion-temporal`;
        assert.equal((await fetch(draftUrl)).status, 404, 'Un borrador no se lee sin permiso');
        const own = await fetch(`${draftUrl}?preview=${signer.sign(pageUid, draftPage.documentId)}`);
        assert.equal(own.status, 200, 'Con su permiso, el borrador se lee');
        assert.equal((await own.json()).pageTitle, 'Borrador de prueba');
        assert.equal((await fetch(`${draftUrl}?preview=${signer.sign(pageUid, tempPage.documentId)}`)).status, 404, 'El permiso de otra página no abre este borrador');
        assert.equal((await fetch(`${draftUrl}?preview=${signer.sign('api::home.home', draftPage.documentId)}`)).status, 404, 'El permiso de otro tipo no abre borradores de páginas');
        assert.equal((await fetch(`${draftUrl}?preview=falso.falso`)).status, 403, 'Un permiso falso se rechaza');
        // Mapa del sitio: la página publicada sí, el borrador no.
        const sitemapResponse = await fetch(`${origin}/api/sitemap.xml`);
        assert.equal(sitemapResponse.status, 200);
        assert.match(sitemapResponse.headers.get('content-type'), /xml/);
        const sitemapXml = await sitemapResponse.text();
        assert.ok(sitemapXml.includes('/prueba-integracion-temporal</loc>'), 'El sitemap incluye las páginas publicadas');
        assert.equal(sitemapXml.includes('borrador-integracion-temporal'), false, 'El sitemap no incluye borradores');
        assert.equal((await fetch(`${origin}/api/content/home?preview=falso.falso`)).status, 403);
        // Los casos de apadrinamiento nunca salen en borrador, ni con un permiso válido de otro tipo.
        const homeToken = signer.sign('api::home.home', 'x');
        const withToken = await (await fetch(`${origin}/api/content/sponsoredCases?preview=${homeToken}`)).json();
        const withoutToken = await (await fetch(`${origin}/api/content/sponsoredCases`)).json();
        assert.deepEqual(withToken, withoutToken, 'La vista previa no cambia el catálogo de casos');
      } finally {
        await app.documents(pageUid).delete({ documentId: draftPage.documentId });
      }
    } finally {
      await app.documents(pageUid).delete({ documentId: tempPage.documentId });
    }
    // Boletines: un PDF real sube y se lee por el listado y el detalle; más de 15 MB se rechaza.
    const fs = require('node:fs');
    const os = require('node:os');
    const uploadService = app.plugin('upload').service('upload');
    const uploadTemp = async (name, bytes, mimetype) => {
      const filepath = path.join(os.tmpdir(), name);
      fs.writeFileSync(filepath, bytes);
      try {
        const [file] = await uploadService.upload({
          data: { fileInfo: { name } },
          files: { filepath, originalFilename: name, mimetype, size: bytes.length },
        });
        return file;
      } finally {
        fs.rmSync(filepath, { force: true });
      }
    };
    await assert.rejects(uploadTemp('boletin-grande.pdf', Buffer.concat([Buffer.from('%PDF-1.4\n'), Buffer.alloc(16 * 1024 * 1024)]), 'application/pdf'),
      /size|tamaño|large|exceed/i, 'Un PDF de más de 15 MB debe rechazarse');
    const pdfFile = await uploadTemp('boletin-prueba.pdf', Buffer.from('%PDF-1.4\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF\n'), 'application/pdf');
    const newsletterUid = 'api::newsletter.newsletter';
    const tempNewsletter = await app.documents(newsletterUid).create({
      data: { title: 'Boletín de prueba', slug: 'boletin-prueba-integracion', period: '2099-01-01', pdf: pdfFile.id },
      status: 'published',
    });
    try {
      const list = await (await fetch(`${origin}/api/content/newsletters?year=2099`)).json();
      assert.deepEqual(list.items.map((item) => item.slug), ['boletin-prueba-integracion']);
      assert.ok(list.years.includes(2099));
      const detail = await fetch(`${origin}/api/content/newsletters/boletin-prueba-integracion`);
      assert.equal(detail.status, 200);
      const { pdf } = await detail.json();
      const pdfResponse = await fetch(pdf.url);
      assert.equal(pdfResponse.status, 200, 'El PDF debe servirse');
      assert.match(pdfResponse.headers.get('content-type'), /application\/pdf/);
      assert.equal((await fetch(`${origin}/api/content/newsletters?year=abc`)).status, 400);
      assert.equal((await fetch(`${origin}/api/newsletters`)).status, 404, 'Sin Content API genérica');
      // Archivos sin uso: un PDF compartido sobrevive mientras otro boletín lo use; al borrar el
      // último, desaparece de la biblioteca y su URL deja de responder.
      const twin = await app.documents(newsletterUid).create({
        data: { title: 'Boletín gemelo', slug: 'boletin-gemelo-integracion', period: '2099-02-01', pdf: pdfFile.id },
        status: 'published',
      });
      await app.documents(newsletterUid).delete({ documentId: twin.documentId });
      assert.ok(await app.db.query('plugin::upload.file').findOne({ where: { id: pdfFile.id } }), 'Un PDF que otro boletín usa no se borra');
      await app.documents(newsletterUid).delete({ documentId: tempNewsletter.documentId });
      assert.equal(await app.db.query('plugin::upload.file').findOne({ where: { id: pdfFile.id } }), null, 'El PDF de un boletín borrado se borra');
      assert.equal((await fetch(pdf.url)).status, 404, 'La URL del PDF borrado ya no responde');
    } finally {
      if (await app.documents(newsletterUid).findOne({ documentId: tempNewsletter.documentId })) {
        await app.documents(newsletterUid).delete({ documentId: tempNewsletter.documentId });
      }
      const leftover = await app.db.query('plugin::upload.file').findOne({ where: { id: pdfFile.id } });
      if (leftover) await uploadService.remove(leftover);
    }
    for (const key of ['nope', '__proto__', 'constructor']) {
      assert.equal((await fetch(`${origin}/api/content/${key}`)).status, 404, `Clave fuera de la lista blanca: ${key}`);
    }
    assert.equal(response.headers.get('cache-control'), 'no-store');
    assert.equal(response.headers.get('x-powered-by'), null, 'Las respuestas no anuncian Strapi');
    const content = await response.json();
    assert.ok(content.hero?.slides.length > 0);
    for (const section of ['about', 'process', 'programsIntro', 'impactSection', 'instagram', 'newsletterIntro']) {
      assert.ok(content[section], `Inicio sin la sección ${section}: ejecuta npm run seed home -- --publish`);
    }
    const site = await (await fetch(`${origin}/api/content/site`)).json();
    assert.ok(site.partners?.heading, 'Falta el encabezado de aliados en Datos del sitio');
    assert.equal(site.partners.logos, undefined, 'Los logos viven en la colección Aliados');
    const { partners } = await (await fetch(`${origin}/api/content/partners`)).json();
    assert.ok(partners.length > 0, 'Faltan los aliados: ejecuta npm run seed partners');
    assert.deepEqual(Object.keys(partners[0]).sort(), ['logo', 'name', 'url'], 'Un aliado solo publica nombre, logo y enlace');
    const logo = await fetch(partners[0].logo.src);
    assert.equal(logo.status, 200, 'El logo del aliado debe servirse');
    assert.equal((await fetch(`${origin}/api/partners`)).status, 404, 'Sin Content API genérica: /api/partners');
    const image = await fetch(content.hero.slides[0].image);
    assert.equal(image.status, 200);
    assert.match(image.headers.get('content-type'), /^image\//);
    for (let i = 0; i < 6; i++) {
      const invalid = await fetch(`${origin}/api/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': `192.0.2.${i}` }, body: '{}' });
      assert.equal(invalid.status, i < 5 ? 400 : 429, 'No debe confiar en la IP enviada directamente');
    }
    const oversized = await fetch(`${origin}/api/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mensaje: 'x'.repeat(18000) }) });
    assert.equal(oversized.status, 413);
    const wrongType = await fetch(`${origin}/api/contact`, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: 'hello' });
    assert.equal(wrongType.status, 415);
    const role = await app.service('admin::role').findOne({ code: 'bamx-editor' });
    assert.ok(role, 'El rol editorial debe estar preparado');
    const permissions = await app.db.query('admin::permission').findMany({ where: { role: role.id } });
    const { EDITORIAL_TYPES } = require('../src/setup/editorial');
    for (const uid of EDITORIAL_TYPES) {
      for (const action of ['read', 'update', 'publish']) {
        assert.ok(permissions.some((p) => p.subject === uid && p.action.endsWith(`.${action}`)), `El editor debe poder ${action} en ${uid}`);
      }
    }
    assert.equal(permissions.some((p) => p.subject && p.subject.startsWith('api::') && !EDITORIAL_TYPES.includes(p.subject)), false, 'El editor no debe tocar tipos fuera de su lista');
    assert.equal(permissions.some((p) => p.subject === 'api::bank-account.bank-account'), false, 'Los datos bancarios son solo de administrador');
    const { DELETABLE_TYPES } = require('../src/setup/editorial');
    const canDelete = permissions.filter((p) => p.action.endsWith('.delete')).map((p) => p.subject).sort();
    assert.deepEqual(canDelete, [...DELETABLE_TYPES].sort(), 'El editor solo borra en colecciones, no en páginas fijas');
    assert.equal(permissions.some((p) => p.action.includes('api-tokens') || p.action.includes('users.') || p.action.includes('roles.')), false);
    const configuration = await app.plugin('content-manager').service('components').findConfiguration(app.components['sections.hero-slide']);
    assert.equal(configuration.metadatas.headingLead.edit.label, 'Título principal');
    assert.equal(configuration.settings.mainField, 'headingLead', 'Las diapositivas se listan por su título');
    const cardConfiguration = await app.plugin('content-manager').service('components').findConfiguration(app.components['shared.card']);
    assert.equal(cardConfiguration.settings.mainField, 'title', 'Las tarjetas se listan por su título, no por un número');
    assert.equal(Boolean(app.plugins.cloud), false, 'El plugin de Strapi Cloud (menú Desplegar) no debe estar instalado');
    assert.equal(app.config.get('plugin::email').provider, 'nodemailer', 'El correo del panel sale por el SMTP de Resend');
    console.log('OK: contenido público directo, API interna restringida, destinatarios privados, contacto limitado, borradores ocultos, casos sin consentimiento bloqueados, páginas con slug seguro, boletines PDF (15 MB), etiquetas y rol editorial. Sin Express ni tokens.');
  } finally { await app.destroy(); }
}
main().catch((error) => { console.error(error.message); process.exitCode = 1; });
