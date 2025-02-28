module moon_package::change_metadata {

    use std::string::String;
    use sui::coin::{Self, TreasuryCap, CoinMetadata};



    public entry fun change_metadata_without_url<T>(treasuryCap: &TreasuryCap<T>, metadata: &mut CoinMetadata<T>, name: String, symbol: String, description: String, url: String) {
       let new_symbol = symbol.to_ascii();
       let new_url = url.to_ascii();
        coin::update_name(
            treasuryCap,
            metadata,
            name
        );
        coin::update_symbol(
            treasuryCap,
            metadata,
            new_symbol  
        );
        coin::update_description(
            treasuryCap,
            metadata,
            description
        );
        coin::update_icon_url(treasuryCap,
            metadata,
            new_url
        );
        
           // transfer::freeze_object<T>(metadata<T>); //am wanting to freeze this afterwards. 
    }
    

    
}