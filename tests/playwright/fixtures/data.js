module.exports = {
    organizations: [
        {
            logo: {
                path: './tests/e2e/fixtures/images/logo.jpeg',
                filename: 'logo.jpeg',
            },
            header: {
                path: './tests/e2e/fixtures/images/background.jpeg',
                filename: 'header.jpeg',
            },
            body: {
                background_color: '#FFFFFF',
                code: 'CRI', // 'TEST1',
                contact_email: 'user@example.com',
                dashboard_title: 'Test 1',
                dashboard_subtitle: 'The first test organization',
                language: 'en',
                main_org_logo_visibility: true,
                name: 'Test 1',
                website_url: 'http://127.0.0.1:8080',
            },
        },
    ],

    categories: [
        {
            organization: 'CRI',
            background: {
                path: './tests/e2e/fixtures/images/background.jpeg',
                filename: 'header.jpeg',
            },
            body: {
                name: 'Reviewable category',
                description: 'A reviewable category',
                background_color: '#FFFFFF',
                foreground_color: '#000000',
                is_reviewable: 'true',
                order_index: 1,
                template: null,
            },
        },
    ],

    projects: [
        {
            organization: 'CRI', // 'TEST1',
            header: {
                path: './tests/e2e/fixtures/images/background.jpeg',
                filename: 'header.jpeg',
            },
            body: {
                title: 'Project 1',
                description: 'This is the first project',
                is_locked: false,
                is_shareable: true,
                purpose: 'Be the first',
                language: 'en',
                publication_status: 'public',
                life_status: 'running',
            },
        },

        {
            organization: 'CRI', // 'TEST1',
            header: {
                path: './tests/e2e/fixtures/images/background.jpeg',
                filename: 'header.jpeg',
            },
            body: {
                title: 'theatre',
                description: 'World is a stage and each one must play a part',
                is_locked: false,
                is_shareable: true,
                purpose: 'Being searchable',
                language: 'en',
                publication_status: 'public',
                life_status: 'running',
            },
        },
    ],
}
