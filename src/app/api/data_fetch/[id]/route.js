import { NextResponse } from "next/server";
import {supabase} from "../../../../lib/supabase"

let clientMap = new Map();

async function databaseQuery(id){

    if(clientMap.has(id)){
        return clientMap.get(id);
    }

    const { data, error } = await supabase
            .from("Clients")
            .select("*")
            .eq("client_id", id)
            .single();

    if(data){
        clientMap.set(id, data);
        return data;
    }
    
    if(error){
        console.log(error);
    }
    return null;
}

export async function GET(request, context) {
    const params = await context.params;
    const data = await databaseQuery(params.id)
    return NextResponse.json(data);
}