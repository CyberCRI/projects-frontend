export const cardListStyles = /* CSS */ `
.card-list {
    --card-width: 3.4cm;
    margin-top: .6cm;
    display: grid;
    gap: 0.6cm;
    grid-template-columns: repeat(auto-fill, var(--card-width));
}

.card-list-title {
    font-size: 1rem;
    font-weight: bold;
    margin-bottom: .4cm;
    color: #1d727c;
    font-weight: bold;
}

.card-item {
    width: var(--card-width);
    height: auto;
    padding: .2cm;
    border: 1px solid #1d727c;
    border-radius: .2cm;
    text-align: center;
    font-size: 1rem;
    display: flex;
    gap: .2cm;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
}
`
