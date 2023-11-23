import React, { useEffect, useState } from 'react';
import {
    Card,
    Typography,
    Heading,
    CardActions,
    DropdownList,
    DropdownListItem,
} from '@contentful/forma-36-react-components';
import { MultipleEntryReferenceEditor } from '@contentful/field-editor-reference';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { FieldExtensionSDK } from '@contentful/app-sdk';

interface FieldProps {
    sdk: FieldExtensionSDK;
}

const Field = (props: FieldProps) => {

    useEffect(() => {
        props.sdk.window.startAutoResizer();
    });

    const [data, setData] = useState<any[]>([]);

    const productReferences = props.sdk.field.getValue()
    const fetchData = async () => {
        productReferences.map(async (value: any) => {
            const entry = await props.sdk.cma.entry.get({ entryId: value.sys.id });
            const title = entry.fields.url ? entry.fields.url["en-US"] : "https://sapcommerce.test4echo.co/occ/v2/perficientpowertools/products/3921093";
            const url = `${title}?fields=code,name,summary,price(formattedValue,DEFAULT),images(galleryIndex,FULL),averageRating,stock(DEFAULT),description,availableForPickup,url,numberOfReviews,manufacturer,categories(FULL),priceRange,multidimensional,configuratorType,configurable,tags`;// your query parameters
            try {
                const response = await fetch(url);
                if (response.ok) {
                    let responseJson = await response.json();
                    setData(prevData => [...prevData, responseJson])
                    // Update state with the fetched data
                } else {
                    console.error('Fetch error:', response.statusText);
                }
            } catch (error) {
                console.error('Fetc h error:', error);
            }
        });
    };

    useEffect(() => {
        fetchData();
    }, []); // Empty dependency array means this runs once on mount


    const customRenderer = (props: any) => {

        const sku = props.entity.fields?.sku?.[props.localeCode];
        const product = data.find(obj => obj.code === sku);
        if (!product) {
            return <Card style={{ flexGrow: 1 }} padding="none">
                <div style={{ display: 'flex' }}>
                    <div style={{ cursor: 'grab' }}>{props.cardDragHandle}</div>
                    <div style={{ flexGrow: 1, padding: '1em' }}>
                        <Typography style={{ marginBottom: '20px' }}>
                            <Heading style={{ borderBottom: '1px solid gray' }}>
                            </Heading>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            </div>
                        </Typography>
                    </div>
                    <div style={{ padding: '1em' }}>
                        <CardActions>
                            <DropdownList>
                                <DropdownListItem onClick={props.onEdit}>
                                    Edit
                                </DropdownListItem>
                                <DropdownListItem onClick={props.onRemove}>
                                    Remove
                                </DropdownListItem>
                            </DropdownList>
                        </CardActions>
                    </div>
                </div>
            </Card>; // Or any other placeholder
        }

        // Once data is available, render your card
        return (
            <Card style={{ flexGrow: 1 }} padding="none">
                <div style={{ display: 'flex' }}>
                    <div style={{ cursor: 'grab' }}>{props.cardDragHandle}</div>
                    <div style={{ flexGrow: 1, padding: '1em' }}>
                        <Typography style={{ marginBottom: '20px' }}>
                            <Heading style={{ borderBottom: '1px solid gray' }}>
                                <b>Sku:</b>{props.entity.fields?.sku?.[props.localeCode]}- {product.code}
                            </Heading>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <img width="100px" src={`https://sapcommerce.test4echo.co/${product.images[0].url}`} alt="" />
                                <div style={{ flex: 1 }} >
                                    <b>Name:</b> {product.name}
                                    <br />
                                    <b>Price:</b>{product.price.value}
                                </div>
                            </div>
                        </Typography>
                    </div>
                    <div style={{ padding: '1em' }}>
                        <CardActions>
                            <DropdownList>
                                <DropdownListItem onClick={props.onEdit}>
                                    Edit
                                </DropdownListItem>
                                <DropdownListItem onClick={props.onRemove}>
                                    Remove
                                </DropdownListItem>
                            </DropdownList>
                        </CardActions>
                    </div>
                </div>
            </Card>
        );
    };

    useEffect(() => {
        console.log("Data state updated:", data);
    }, [customRenderer]);

    if (!productReferences || data.length === productReferences.length) {
        return (<MultipleEntryReferenceEditor
            renderCustomCard={customRenderer}
            viewType="card"
            sdk={props.sdk}
            isInitiallyDisabled
            hasCardEditActions
            parameters={{
                instance: {
                    showCreateEntityAction: true,
                    showLinkEntityAction: true,
                },
            }}

        />)
    }
    else {
        return <div>Loading...</div>;
    }

};

export default Field;