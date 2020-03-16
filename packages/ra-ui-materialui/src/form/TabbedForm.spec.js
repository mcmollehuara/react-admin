import { cleanup } from '@testing-library/react';
import React, { createElement } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { renderWithRedux } from 'ra-core';

import TabbedForm, { findTabsWithErrors } from './TabbedForm';
import FormTab from './FormTab';

describe('<TabbedForm />', () => {
    afterEach(cleanup);

    it('should display the tabs', () => {
        const { queryAllByRole } = renderWithRedux(
            <MemoryRouter initialEntries={['/']}>
                <TabbedForm>
                    <FormTab label="tab1" />
                    <FormTab label="tab2" />
                </TabbedForm>
            </MemoryRouter>
        );

        const tabs = queryAllByRole('tab');
        expect(tabs.length).toEqual(2);
    });

    it('should pass submitOnEnter to <Toolbar />', () => {
        const Toolbar = ({ submitOnEnter }) => (
            <p>submitOnEnter: {submitOnEnter.toString()}</p>
        );

        const { queryByText, rerender } = renderWithRedux(
            <MemoryRouter initialEntries={['/']}>
                <TabbedForm submitOnEnter={false} toolbar={<Toolbar />}>
                    <FormTab label="tab1" />
                    <FormTab label="tab2" />
                </TabbedForm>
            </MemoryRouter>
        );

        expect(queryByText('submitOnEnter: false')).not.toBeNull();

        rerender(
            <MemoryRouter initialEntries={['/']}>
                <TabbedForm submitOnEnter toolbar={<Toolbar />}>
                    <FormTab label="tab1" />
                    <FormTab label="tab2" />
                </TabbedForm>
            </MemoryRouter>
        );

        expect(queryByText('submitOnEnter: true')).not.toBeNull();
    });

    describe('findTabsWithErrors', () => {
        it('should find the tabs containing errors', () => {
            const errors = {
                field1: 'required',
                field5: 'required',
                field7: {
                    test: 'required',
                },
            };
            const children = [
                createElement(
                    FormTab,
                    { label: 'tab1' },
                    createElement('input', { source: 'field1' }),
                    createElement('input', { source: 'field2' })
                ),
                createElement(
                    FormTab,
                    { label: 'tab2' },
                    createElement('input', { source: 'field3' }),
                    createElement('input', { source: 'field4' })
                ),
                createElement(
                    FormTab,
                    { label: 'tab3' },
                    createElement('input', { source: 'field5' }),
                    createElement('input', { source: 'field6' })
                ),
                createElement(
                    FormTab,
                    { label: 'tab4' },
                    createElement('input', { source: 'field7.test' }),
                    createElement('input', { source: 'field8' })
                ),
            ];

            const tabs = findTabsWithErrors(children, errors);
            expect(tabs).toEqual(['tab1', 'tab3', 'tab4']);
        });
    });

    it('should have scroll buttons when too much Tabs />', () => {
        const { queryByLabelText } = renderWithRedux(
            <MemoryRouter initialEntries={['/']}>
                <TabbedForm
                    style={{
                        width: 200,
                        maxWidth: 200,
                    }}
                >
                    <FormTab label="A Useful Tab 1" />
                    <FormTab label="A Useful Tab 2" />
                    <FormTab label="A Useful Tab 3" />
                    <FormTab label="A Useful Tab 4" />
                    <FormTab label="A Useful Tab 5" />
                    <FormTab label="A Useful Tab 6" />
                    <FormTab label="A Useful Tab 7" />
                </TabbedForm>
            </MemoryRouter>
        );

        const tabs = queryByLabelText('Form-tabs');

        expect(tabs.children).toHaveLength(4);
    });

    it('should not have scroll buttons when too much Tabs />', () => {
        const { queryByLabelText } = renderWithRedux(
            <MemoryRouter initialEntries={['/']}>
                <TabbedForm
                    style={{
                        width: 200,
                        maxWidth: 200,
                    }}
                    scrollable={false}
                >
                    <FormTab label="A Useful Tab 1" />
                    <FormTab label="A Useful Tab 2" />
                    <FormTab label="A Useful Tab 3" />
                    <FormTab label="A Useful Tab 4" />
                    <FormTab label="A Useful Tab 5" />
                    <FormTab label="A Useful Tab 6" />
                    <FormTab label="A Useful Tab 7" />
                </TabbedForm>
            </MemoryRouter>
        );

        const tabs = queryByLabelText('Form-tabs');

        expect(tabs.children).toHaveLength(1);
    });
});
