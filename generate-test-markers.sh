#!/bin/bash

# Default values
DENSITY=10  # Number of markers per continent
OVERRIDE=false
REMOVE_ONLY=false

# Help message
show_help() {
    echo "Usage: $0 [options]"
    echo "Options:"
    echo "  -d, --density NUM    Number of markers per continent (default: 10)"
    echo "  -o, --override       Remove all existing markers before generating new ones"
    echo "  -r, --remove-only    Only remove all existing markers"
    echo "  -h, --help          Show this help message"
    exit 0
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -d|--density)
            DENSITY="$2"
            shift 2
            ;;
        -o|--override)
            OVERRIDE=true
            shift
            ;;
        -r|--remove-only)
            REMOVE_ONLY=true
            shift
            ;;
        -h|--help)
            show_help
            ;;
        *)
            echo "Unknown option: $1"
            show_help
            ;;
    esac
done

# Check if sqlite3 is installed
if ! command -v sqlite3 &> /dev/null; then
    echo "Error: sqlite3 is not installed. Please install it first."
    exit 1
fi

# Database file path
DB_FILE="markers.db"

# Function to remove all markers
remove_all_markers() {
    echo "Removing all existing markers..."
    sqlite3 "$DB_FILE" "DELETE FROM markers;"
    echo "All markers removed."
}

# Function to generate random coordinates within a bounding box
generate_random_coordinates() {
    local min_lat=$1
    local max_lat=$2
    local min_lng=$3
    local max_lng=$4
    
    # Generate random coordinates
    local lat=$(awk -v min=$min_lat -v max=$max_lat 'BEGIN{srand(); print min+rand()*(max-min)}')
    local lng=$(awk -v min=$min_lng -v max=$max_lng 'BEGIN{srand(); print min+rand()*(max-min)}')
    
    echo "$lat $lng"
}

# Function to generate a random website
generate_random_website() {
    local domains=("example.com" "test.org" "demo.net" "sample.io" "mock.dev")
    local domain=${domains[$RANDOM % ${#domains[@]}]}
    echo "https://test-$RANDOM.$domain"
}

# Function to generate a random name
generate_random_name() {
    local prefixes=("Test" "Demo" "Sample" "Mock" "Trial")
    local suffixes=("Site" "Location" "Point" "Marker" "Node")
    local prefix=${prefixes[$RANDOM % ${#prefixes[@]}]}
    local suffix=${suffixes[$RANDOM % ${#suffixes[@]}]}
    echo "$prefix $suffix $RANDOM"
}

# Function to generate a random description
generate_random_description() {
    local descriptions=(
        "A test location for demonstration purposes."
        "This is a sample marker for testing the application."
        "Mock data point for development and testing."
        "Temporary marker for system validation."
        "Test site for Earth-Link application."
    )
    echo "${descriptions[$RANDOM % ${#descriptions[@]}]}"
}

# Function to generate markers for a continent
generate_continent_markers() {
    local min_lat=$1
    local max_lat=$2
    local min_lng=$3
    local max_lng=$4
    local count=$5
    
    for ((i=1; i<=count; i++)); do
        read lat lng <<< $(generate_random_coordinates "$min_lat" "$max_lat" "$min_lng" "$max_lng")
        local website=$(generate_random_website)
        local name=$(generate_random_name)
        local description=$(generate_random_description)
        
        sqlite3 "$DB_FILE" << EOF
        INSERT INTO markers (
            latitude, longitude, website, siteName, siteDescription,
            isAnonymous, created_at
        ) VALUES (
            $lat, $lng, '$website', '$name', '$description',
            1, CURRENT_TIMESTAMP
        );
EOF
    done
}

# Main execution
if [ "$REMOVE_ONLY" = true ]; then
    remove_all_markers
    exit 0
fi

if [ "$OVERRIDE" = true ]; then
    remove_all_markers
fi

echo "Generating $DENSITY markers per continent..."

# Define continent boundaries (approximate)
# North America
generate_continent_markers 24.396308 -83.100000 -168.000000 -52.000000 "$DENSITY"

# South America
generate_continent_markers -56.000000 12.000000 -82.000000 -34.000000 "$DENSITY"

# Europe
generate_continent_markers 36.000000 71.000000 -10.000000 40.000000 "$DENSITY"

# Africa
generate_continent_markers -35.000000 37.000000 -18.000000 52.000000 "$DENSITY"

# Asia
generate_continent_markers 10.000000 77.000000 26.000000 180.000000 "$DENSITY"

# Australia
generate_continent_markers -43.000000 -10.000000 113.000000 154.000000 "$DENSITY"

echo "Test markers generation complete!" 